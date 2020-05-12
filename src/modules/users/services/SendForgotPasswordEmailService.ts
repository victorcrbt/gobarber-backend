import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
// import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/error/AppError';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  public async run({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        status: 400,
        message: 'No user found for the provided email.',
      });
    }

    await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido.'
    );
  }
}

export default SendForgotPasswordEmailService;
