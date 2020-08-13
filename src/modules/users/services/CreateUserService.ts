import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
        ){}

    public async execute({ name, email, password }: RequestDTO): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('User already exists');
        }

        const passwordHash = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: passwordHash,
        });

        return user;
    }
}

export default CreateUserService;
