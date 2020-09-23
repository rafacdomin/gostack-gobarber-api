import { sign } from 'jsonwebtoken';
import auth from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new AppError('User not found, please verify your credentials', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('User not found, please verify your credentials', 401);
    }

    const token = sign({}, auth.jwt.secret, {
      subject: user.id,
      expiresIn: auth.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
