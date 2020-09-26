import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/error/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
            );
    });

    it('should be able reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({ token, password: '678910'});

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('678910');
        expect(updateUser?.password).toBe('678910');
    });

    it('should not be able reset the password with a non-existing token', async () => {
        await expect(resetPassword.execute({
            token: 'non-existing-token',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able reset the password with a non-existing user', async () => {

        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(resetPassword.execute({
            token,
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able reset the password after 2 hours of token creation', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123456'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({
                token,
                password: '678910'
            })
            ).rejects.toBeInstanceOf(AppError);
    });

});
