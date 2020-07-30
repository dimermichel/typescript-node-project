import { Router, Request, Response } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';
import uploadConfig from '@config/upload';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    delete user.password;
    return res.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuth,
    upload.single('avatar'),
    async (req, res) => {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);
        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFilename: req.file.filename,
        });
        delete user.password;
        return res.json(user);
    },
);

export default usersRouter;
