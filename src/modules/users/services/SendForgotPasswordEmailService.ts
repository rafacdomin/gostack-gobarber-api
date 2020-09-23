import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';

import AppError from '@shared/errors/AppErros';
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

    const forgotPasswordTemplatePath = path.resolve(
      __dirname,
      '..',
      'templates',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: userExists.name,
        email: userExists.email,
      },
      subject: '[GoBarber] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplatePath,
        variables: {
          name: userExists.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
