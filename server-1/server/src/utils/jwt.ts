import jwt, { Secret, SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (payload: object, expiresIn: string = '7d') => {
    return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};