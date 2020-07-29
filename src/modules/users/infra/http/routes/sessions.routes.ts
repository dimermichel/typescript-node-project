import { Router } from 'express';
import AuthUserService from '@modules/users/services/AuthUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    const { email, password } = req.body;

    const authUser = new AuthUserService();
    const { user, token } = await authUser.execute({ email, password });

    delete user.password;
    return res.json({ user, token });
});

export default sessionsRouter;
