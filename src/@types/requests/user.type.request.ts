export interface RegisterReqBody {
    email: string;
    name: string;
    password: string;
    date_of_birth: string;
}

export interface LoginReqBody {
    email: string;
    password: string;
}
