import 'dotenv/config';
import { WithId } from 'mongodb';
import { RegisterReqBody } from '~/@types/requests/user.type.request';
import { JWT_ALGORITHM } from '~/constants/constant';
import { TokenType } from '~/constants/enum';
import User, { IUser } from '~/models/schemas/user.schema';
import signToken from '~/utils/jwt';
import hashPasswordOneWay from '~/utils/security';
import databaseService from './database.services';
import refreshTokenServices from './refresh_token.services';

class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    private signAccessToken(user_id: string): Promise<string> {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.ACCESS_TOKEN
            },
            secretKey: process.env.JWT_ACCESS_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.ACCESS_KEY_EXPIRES_IN
            }
        });
    }

    private signRefreshToken(user_id: string): Promise<string> {
        return signToken({
            payload: {
                user_id,
                token_type: TokenType.REFRESH_TOKEN
            },
            secretKey: process.env.JWT_REFRESH_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.REFRESH_KEY_EXPIRES_IN
            }
        });
    }

    private async signTokens(user_id: string): Promise<[access_token: string, refresh_token: string]> {
        return await Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)]);
    }

    public async register(payload: RegisterReqBody): Promise<{
        access_token: string;
        refresh_token: string;
    }> {
        const response = await databaseService.users.insertOne(
            new User({
                ...payload,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPasswordOneWay(payload.password)
            })
        );

        const user_id = response.insertedId.toString();
        const [access_token, refresh_token] = await this.signTokens(user_id);

        await refreshTokenServices.createRefreshTokenByUserId({
            token: refresh_token,
            user_id: user_id
        });

        return { access_token, refresh_token };
    }

    public async checkExistEmail(payload: { email: string }): Promise<WithId<IUser> | null> {
        const user = await databaseService.users.findOne({ email: payload.email });
        return user;
    }

    public async checkLogin(payload: { email: string; password: string }): Promise<WithId<IUser> | null> {
        const user = await databaseService.users.findOne({
            email: payload.email,
            password: payload.password
        });
        return user;
    }

    public async login(user_id: string) {
        const [access_token, refresh_token] = await this.signTokens(user_id);

        await refreshTokenServices.createRefreshTokenByUserId({
            token: refresh_token,
            user_id: user_id
        });

        return {
            access_token,
            refresh_token
        };
    }
}

const userServices = UserService.getInstance();

export default userServices;
