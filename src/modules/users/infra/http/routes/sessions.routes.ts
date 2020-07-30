import { Router } from 'express';
import AuthUserService from '@modules/users/services/AuthUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    const usersRepository = new UsersRepository();

    const authUser = new AuthUserService(usersRepository);
    const { user, token } = await authUser.execute({ email, password });

    delete user.password;
    return res.json({ user, token });
});

export default sessionsRouter;
