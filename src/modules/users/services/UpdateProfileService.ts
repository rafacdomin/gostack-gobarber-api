import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepo.findByID(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userWithNewEmail = await this.usersRepo.findByEmail(email);

    if (userWithNewEmail && userWithNewEmail.id !== user_id) {
      throw new AppError('Email already used.', 401);
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Old password is required to update password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepo.save(user);
  }
}

export default UpdateProfileService;
