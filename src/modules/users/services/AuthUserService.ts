import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class AuthUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
        ){}

    public async execute({ email, password }: Request): Promise<Response> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email or password provided.', 401);
        }

        const passwordMatch = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Incorrect email or password provided.', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthUserService;
