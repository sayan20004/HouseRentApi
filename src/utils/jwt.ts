import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generate JWT access token
 */
export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as any };
    return jwt.sign(payload, config.jwt.secret, options);
};

/**
 * Verify JWT token and return decoded payload
 */
export const verifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
