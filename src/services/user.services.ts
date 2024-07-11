import 'dotenv/config';
import { ObjectId, WithId } from 'mongodb';
import { RegisterReqBody } from '~/@types/requests/user.type.request';
import { JWT_ALGORITHM } from '~/constants/constant';
import { TokenType } from '~/constants/enum';
import { SUCCESS_MESSAGES } from '~/constants/messages';
import User, { EUserVerifyStatus, IUser } from '~/models/schemas/user.schema';
import { signToken } from '~/utils/jwt';
import hashPasswordOneWay from '~/utils/security';
import databaseService from './database.services';
import refreshTokenServices from './refresh_token.services';
import {} from '../models/schemas/user.schema';
class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    // Create Access Token
    private signAccessToken(payload: { user_id: string }): Promise<string> {
        return signToken({
            payload: {
                user_id: payload.user_id,
                token_type: TokenType.ACCESS_TOKEN
            },
            secretKey: process.env.JWT_ACCESS_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.ACCESS_KEY_EXPIRES_IN
            }
        });
    }

    // Create Refresh Token
    private signRefreshToken(payload: { user_id: string }): Promise<string> {
        return signToken({
            payload: {
                user_id: payload.user_id,
                token_type: TokenType.REFRESH_TOKEN
            },
            secretKey: process.env.JWT_REFRESH_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.REFRESH_KEY_EXPIRES_IN
            }
        });
    }

    // Create Verify Email Token
    private signEmailVerifyToken(payload: { user_id: string }): Promise<string> {
        return signToken({
            payload: {
                user_id: payload.user_id,
                token_type: TokenType.EMAIL_VERIFY_TOKEN
            },
            secretKey: process.env.JWT_EMAIL_VERIFY_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.EMAIL_VERIFY_KEY_EXPIRES_IN
            }
        });
    }

    // Create Forgot Password Token
    private signForgotPasswordToken(payload: { user_id: string }): Promise<string> {
        return signToken({
            payload: {
                user_id: payload.user_id,
                token_type: TokenType.FORGOT_PASSWORD_TOKEN
            },
            secretKey: process.env.JWT_FORGOT_PASSWORD_KEY as string,
            options: {
                algorithm: JWT_ALGORITHM,
                expiresIn: process.env.FORGOT_PASSWORD_KEY_EXPIRES_IN
            }
        });
    }

    // Create Access & Refresh Token
    private async signTokens(payload: { user_id: string }): Promise<[access_token: string, refresh_token: string]> {
        return await Promise.all([
            this.signAccessToken({ user_id: payload.user_id }),
            this.signRefreshToken({ user_id: payload.user_id })
        ]);
    }

    // Register
    public async register(payload: RegisterReqBody): Promise<{
        access_token: string;
        refresh_token: string;
    }> {
        const usr_id = new ObjectId();
        const email_verify_token = await this.signEmailVerifyToken({ user_id: usr_id.toString() });

        await databaseService.users.insertOne(
            new User({
                ...payload,
                _id: usr_id,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPasswordOneWay(payload.password),
                email_verify_token: email_verify_token
            })
        );
        console.log('Your email verify', email_verify_token);
        const [access_token, refresh_token] = await this.signTokens({ user_id: usr_id.toString() });

        await refreshTokenServices.createRefreshTokenByUserId({
            token: refresh_token,
            user_id: usr_id.toString()
        });

        return { access_token, refresh_token };
    }

    // Check Login
    public async checkLogin(payload: { email: string; password: string }): Promise<WithId<IUser> | null> {
        const user = await databaseService.users.findOne({
            email: payload.email,
            password: payload.password
        });
        return user;
    }

    // Login
    public async login(payload: { user_id: string }) {
        const [access_token, refresh_token] = await this.signTokens({ user_id: payload.user_id });

        await refreshTokenServices.createRefreshTokenByUserId({
            token: refresh_token,
            user_id: payload.user_id
        });

        return {
            access_token,
            refresh_token
        };
    }

    //Logout
    public async logout(payload: { token: string }): Promise<{ message: string }> {
        await refreshTokenServices.deleteRefreshToken({ token: payload.token });
        return {
            message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
        };
    }

    // Check email exist
    public async checkExistEmail(payload: { email: string }): Promise<WithId<IUser> | null> {
        const user = await databaseService.users.findOne({ email: payload.email });
        return user;
    }

    //Check email verify
    public async checkExistUserByVerifyTokenId(payload: { user_id: string }) {
        const user = await databaseService.users.findOne({
            _id: new ObjectId(payload.user_id)
        });
        return user;
    }

    public async checkExistUserById(payload: { user_id: string }): Promise<WithId<IUser> | null> {
        const user = await databaseService.users.findOne({ _id: new ObjectId(payload.user_id) });
        return user;
    }

    public async verifyEmail(payload: { user_id: string }) {
        const [_, [access_token, refresh_token]] = await Promise.all([
            databaseService.users.updateOne(
                {
                    _id: new ObjectId(payload.user_id)
                },
                {
                    $set: {
                        email_verify_token: '',
                        verify: EUserVerifyStatus.Verified
                    },
                    $currentDate: {
                        updated_at: true
                    }
                }
            ),
            this.signTokens({ user_id: payload.user_id })
        ]);

        return {
            access_token,
            refresh_token
        };
    }

    //Resend Verify Email
    public async resendVerifyEmail(payload: { user_id: string }): Promise<{
        message: string;
    }> {
        //Assump send email
        const email_verify_token = await this.signEmailVerifyToken({ user_id: payload.user_id });
        console.log('Resned verify email', email_verify_token);

        await databaseService.users.updateOne(
            {
                _id: new ObjectId(payload.user_id)
            },
            {
                $set: {
                    email_verify_token: email_verify_token
                },
                $currentDate: {
                    updated_at: true
                }
            }
        );

        return { message: SUCCESS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS };
    }

    //Update forgot password field
    public async updateForgotPassword(payload: { user_id: string }): Promise<{
        message: string;
    }> {
        const forgot_password_token = await this.signForgotPasswordToken({ user_id: payload.user_id });

        console.log('Send Forgot password token', forgot_password_token);

        await databaseService.users.updateOne(
            {
                _id: new ObjectId(payload.user_id)
            },
            {
                $set: {
                    forgot_password_token
                },
                $currentDate: {
                    updated_at: true
                }
            }
        );

        return { message: SUCCESS_MESSAGES.SEND_LINK_FORGOT_PASSWORD_EMAIL_SUCCESS };
    }
}

const userServices = UserService.getInstance();

export default userServices;
