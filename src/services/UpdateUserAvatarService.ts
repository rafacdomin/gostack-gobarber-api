import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

import uploadConfig from '../config/upload';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const usersRepo = getRepository(User);

    const user = await usersRepo.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change the avatar.');
    }

    if (user.avatar) {
      const filepath = path.join(uploadConfig.directory, user.avatar);

      const fileExists = await fs.promises.stat(filepath);

      if (fileExists) {
        await fs.promises.unlink(filepath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepo.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
