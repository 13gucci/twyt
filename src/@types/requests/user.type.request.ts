import { JwtPayload } from 'jsonwebtoken';
import { TokenType } from '~/constants/enum';

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

export interface LogoutReqBody {
    refresh_token: string;
}

export interface VerifyEmailReqBody {
    email_verify_token: string;
}

export interface ForgotPasswordReqBody {
    email: string;
}

export interface TokenPayload extends JwtPayload {
    user_id: string;
    token_type: TokenType;
}
