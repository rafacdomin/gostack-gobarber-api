import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErros';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private usersRepo: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepo.findByID(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can change the avatar.',
        401,
      );
    }

    if (user.avatar) {
      const filepath = path.join(uploadConfig.directory, user.avatar);

      const fileExists = await fs.promises.stat(filepath);

      if (fileExists) {
        await fs.promises.unlink(filepath);
      }
    }

    user.avatar = avatarFilename;

    await this.usersRepo.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
