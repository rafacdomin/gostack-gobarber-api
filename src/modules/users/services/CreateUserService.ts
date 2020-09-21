import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';
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
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepo.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email adress already used');
    }

    const passwordHash = await hash(password, 8);

    const user = await this.usersRepo.create({
      name,
      email,
      password: passwordHash,
    });

    delete user.password;

    return user;
  }
}

export default CreateUserService;
