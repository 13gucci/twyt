import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const signToken = ({
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

export default signToken;
