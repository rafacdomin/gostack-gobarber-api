import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppErros';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepo: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepo.findByToken(token);

    if (!userToken) {
      throw new AppError('Invalid Token');
    }

    const user = await this.usersRepo.findByID(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Expired Token');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepo.save(user);
  }
}

export default ResetPasswordService;
