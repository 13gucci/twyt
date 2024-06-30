import User from '~/models/schemas/user.schema';
import databaseService from './database.services';

class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public async register(payload: { email: string; password: string }) {
        const response = await databaseService.users.insertOne(
            new User({
                email: payload.email,
                password: payload.password
            })
        );
        return response;
    }
}

const userServices = UserService.getInstance();

export default userServices;
