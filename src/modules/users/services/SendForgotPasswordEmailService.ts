import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/error/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';


interface RequestDTO {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
    ) { }

    public async execute({ email }: RequestDTO): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if  (!user) {
            throw new AppError('User does not exist.');
        }

        const { token } = await this.userTokensRepository.generate(user.id);

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] - Password Recovery',
            templateData: {
                template: 'Hi, {{name}}. Your token is: {{token}}',
                variables: {
                    name: user.name,
                    token,
                },
            }
        });
    }
}

export default SendForgotPasswordEmailService;

// RED / GREEN / REFACTOR
