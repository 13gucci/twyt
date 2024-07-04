import { ObjectId } from 'mongodb';

export interface IRefreshToken {
    _id: ObjectId;
    token: string;
    created_at?: Date;
    user_id: ObjectId;
}

export class RefreshToken {
    _id: ObjectId;
    token: string;
    created_at: Date;
    user_id: ObjectId;

    constructor(token: Omit<IRefreshToken, '_id'>) {
        this._id = new ObjectId();
        this.token = token.token;
        this.created_at = new Date();
        this.user_id = token.user_id;
    }
}
