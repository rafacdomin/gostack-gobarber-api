import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';
import IHashProvider from '@modules/users/providers/hashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepo.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email adress already used');
    }

    const passwordHash = await this.hashProvider.generateHash(password);

    const user = await this.usersRepo.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}

export default CreateUserService;
