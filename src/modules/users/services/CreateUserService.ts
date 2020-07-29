import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);
        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new AppError('User already exists');
        }

        const passwordHash = await hash(password, 10);

        const user = usersRepository.create({
            name,
            email,
            password: passwordHash,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
