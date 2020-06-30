import { Router } from 'express';
import AuthUserService from '../services/AuthUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const authUser = new AuthUserService();
        const { user, token } = await authUser.execute({ email, password });

        delete user.password;
        return res.json({ user, token });
    } catch (err) {
        return res.status(400).json({ err: err.message });
    }
});

export default sessionsRouter;
