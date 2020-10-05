import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/ICacheProvider';

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(except_user_id: string): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${except_user_id}`,
    );

    if (!users) {
      users = await this.usersRepo.findAllProviders(except_user_id);

      await this.cacheProvider.save(`providers-list:${except_user_id}`, users);
    }

    return users;
  }
}

export default ListProvidersService;
