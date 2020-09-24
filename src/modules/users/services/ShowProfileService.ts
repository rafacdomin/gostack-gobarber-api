import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.usersRepo.findByID(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default ShowProfileService;
