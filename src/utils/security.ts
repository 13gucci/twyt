import { createHash } from 'node:crypto';
import 'dotenv/config';

const sha256 = (content: string): string => {
    return createHash('sha256').update(content).digest('hex');
};

const hashPasswordOneWay = (password: string): string => {
    return sha256(password + process.env.PASSWORD_SECRET);
};

export default hashPasswordOneWay;
