import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuth from '../middlewares/ensureAuth';
import uploadConfig from '../config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(user);
  } catch (err) {
    return res.status(err.statusCode).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuth,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const updateAvatarService = new UpdateUserAvatarService();

      const user = await updateAvatarService.execute({
        user_id: req.user.id,
        avatarFilename: req.file.filename,
      });

      return res.json(user);
    } catch (err) {
      return res.status(err.statusCode).json({ error: err.message });
    }
  },
);

export default usersRouter;
