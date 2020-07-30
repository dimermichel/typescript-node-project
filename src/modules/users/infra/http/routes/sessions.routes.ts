import { Router } from 'express';
import {container} from 'tsyringe';
import AuthUserService from '@modules/users/services/AuthUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const authUser = container.resolve(AuthUserService);
    const { user, token } = await authUser.execute({ email, password });

    delete user.password;
    return res.json({ user, token });
});

export default sessionsRouter;
