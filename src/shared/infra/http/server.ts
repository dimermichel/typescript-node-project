import dotenv from 'dotenv';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return res.status(500).json({
        status: 'error',
        message: 'internal server error',
    });
});

app.listen(3333, () => {
    console.log('Server running on port 3333. 🏍 💨');
});
