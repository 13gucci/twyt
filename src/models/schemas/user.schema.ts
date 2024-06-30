import { ObjectId } from 'mongodb';

enum EUserVerifyStatus {
    Unverified, // chưa xác thực email, mặc định = 0
    Verified, // đã xác thực email
    Banned // bị khóa
}

export interface IUser {
    _id?: ObjectId;
    name?: string;
    email: string;
    date_of_birth?: Date;
    password: string;
    created_at?: Date;
    updated_at?: Date;
    email_verify_token?: string;
    forgot_password_token?: string;
    verify?: EUserVerifyStatus;
    bio?: string;
    location?: string;
    website?: string;
    username?: string;
    avatar?: string;
    cover_photo?: string;
}

export default class User {
    _id: ObjectId;
    name: string;
    email: string;
    date_of_birth: Date;
    password: string;
    created_at: Date;
    updated_at: Date;
    email_verify_token: string;
    forgot_password_token: string;
    verify: EUserVerifyStatus;
    bio: string;
    location: string;
    website: string;
    username: string;
    avatar: string;
    cover_photo: string;

    constructor(usr: IUser) {
        const currentDate = new Date();

        this._id = new ObjectId();
        this.name = usr.name ?? '';
        this.email = usr.email;
        this.date_of_birth = usr.date_of_birth ?? currentDate;
        this.password = usr.password;
        this.created_at = usr.created_at ?? currentDate;
        this.updated_at = usr.updated_at ?? currentDate;
        this.email_verify_token = usr.email_verify_token ?? '';
        this.bio = usr.bio ?? '';
        this.forgot_password_token = usr.forgot_password_token ?? '';
        this.verify = usr.verify ?? EUserVerifyStatus.Unverified;
        this.location = usr.location ?? '';
        this.website = usr.website ?? '';
        this.username = usr.username ?? '';
        this.avatar = usr.avatar ?? '';
        this.cover_photo = usr.cover_photo ?? '';
    }
}
