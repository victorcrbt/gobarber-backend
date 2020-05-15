import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/error/AppError';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError({
        status: 404,
        message: 'User not found.',
      });
    }

    const emailAlreadyUsed = await this.usersRepository.findByEmail(email);

    if (email !== user.email && emailAlreadyUsed) {
      throw new AppError({
        status: 400,
        message: 'The provided email is already in use.',
      });
    }

    if (password && !old_password) {
      throw new AppError({
        status: 400,
        message:
          'You must provide the old password to be able to update the password.',
      });
    }

    if (password && old_password) {
      const oldPasswordMatches = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      if (!oldPasswordMatches) {
        throw new AppError({
          status: 401,
          message: 'The old password is incorrect.',
        });
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    Object.assign(user, {
      name,
      email,
    });

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
