import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuth(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    // JWT token validation
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');
    const { secret } = authConfig.jwt;

    try {
        const decoded = verify(token, secret, {});
        // console.log(decoded);
        const { sub } = decoded as TokenPayload;

        req.user = { id: sub };

        return next();
    } catch (err) {
        throw new AppError('Invalid JWT Token', 401);
    }
}
