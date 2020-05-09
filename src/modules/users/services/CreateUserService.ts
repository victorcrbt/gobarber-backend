import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/error/AppError';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async run({ name, email, password }: IRequestDTO): Promise<User> {
    const emailAlreadyUsed = await this.usersRepository.findByEmail(email);

    if (emailAlreadyUsed) {
      throw new AppError({
        status: 400,
        message: 'The provided email is already in use.',
      });
    }

    const user = await this.usersRepository.create({ name, email, password });

    return user;
  }
}

export default CreateUserService;
