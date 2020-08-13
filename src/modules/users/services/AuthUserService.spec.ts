import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthUserService from './AuthUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/error/AppError';


describe('AuthUser', () => {
    it('should be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();

        const createUser = new CreateUserService(fakeUsersRepository);
        const authUser = new AuthUserService(fakeUsersRepository);

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const response = await authUser.execute({
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
    });

})
