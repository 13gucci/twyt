import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { IRefreshToken, RefreshToken } from '~/models/schemas/refresh_token.schema';
import databaseService from './database.services';

class RefreshTokenService {
    private static instance: RefreshTokenService;

    private constructor() {}

    public static getInstance(): RefreshTokenService {
        if (!RefreshTokenService.instance) {
            RefreshTokenService.instance = new RefreshTokenService();
        }
        return RefreshTokenService.instance;
    }

    public async createRefreshTokenByUserId(payload: {
        token: string;
        user_id: string;
    }): Promise<InsertOneResult<IRefreshToken>> {
        const response = await databaseService.refresh_token.insertOne(
            new RefreshToken({
                token: payload.token,
                user_id: new ObjectId(payload.user_id)
            })
        );

        return response;
    }

    public async checkExistRefreshToken(payload: { token: string }): Promise<WithId<IRefreshToken> | null> {
        const response = await databaseService.refresh_token.findOne({ token: payload.token });
        return response;
    }

    public async deleteRefreshToken(payload: { token: string }) {
        await databaseService.refresh_token.deleteOne({ token: payload.token });
    }
}

const refreshTokenServices = RefreshTokenService.getInstance();
export default refreshTokenServices;
