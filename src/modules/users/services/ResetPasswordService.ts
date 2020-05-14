import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
// import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/error/AppError';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError({
        status: 404,
        message: 'User token not found.',
      });
    }

    const tokenExpiration = addHours(userToken.created_at, 2);
    const tokenIsExpired = isAfter(Date.now(), tokenExpiration);

    if (tokenIsExpired) {
      throw new AppError({
        status: 403,
        message: 'User token is expired.',
      });
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError({
        status: 404,
        message: 'User not found.',
      });
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
