import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '~/@types/requests/user.type.request';

export const signToken = ({
    payload,
    secretKey,
    options
}: {
    payload: string | Buffer | object;
    secretKey: Secret;
    options: SignOptions;
}): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secretKey, options, (err, token) => {
            if (err) {
                throw reject(err);
            }
            return resolve(token as string);
        });
    });
};

export const verifyToken = ({ token, secretKey }: { token: string; secretKey: Secret }): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                throw reject(err);
            }
            resolve(decoded as TokenPayload);
        });
    });
};
