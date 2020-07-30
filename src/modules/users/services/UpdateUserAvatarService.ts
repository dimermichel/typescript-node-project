import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        ){}

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Need auth credentials to update avatar', 401);
        }

        if (user.avatar) {
            // Delete previous avatar

            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
