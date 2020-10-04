import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,
  ) {}

  public async execute(except_user_id: string): Promise<User[]> {
    const user = await this.usersRepo.findAllProviders(except_user_id);

    return user;
  }
}

export default ListProvidersService;
