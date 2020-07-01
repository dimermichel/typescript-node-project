import { Router, Request, Response } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuth from '../middlewares/ensureAuth';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({ name, email, password });

        delete user.password;
        return res.json(user);
    } catch (err) {
        return res.status(400).json({ err: err.message });
    }
});

usersRouter.patch(
    '/avatar',
    ensureAuth,
    upload.single('avatar'),
    async (req, res) => {
        try {
            const updateUserAvatar = new UpdateUserAvatarService();
            const user = await updateUserAvatar.execute({
                user_id: req.user.id,
                avatarFilename: req.file.filename,
            });
            delete user.password;
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ err: err.message });
        }
    },
);

export default usersRouter;
