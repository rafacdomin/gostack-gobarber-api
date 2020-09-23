import { injectable, inject } from 'tsyringe';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';

import AppError from '@shared/errors/AppErros';
// import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepo: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepo: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const userExists = await this.usersRepo.findByEmail(email);

    if (!userExists) {
      throw new AppError('User does not exists', 401);
    }

    const { token } = await this.userTokensRepo.generate(userExists.id);

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha recebido
      Token: ${token}
      `,
    );
  }
}

export default SendForgotPasswordEmailService;
