import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

import authConfig from '@config/auth';
import AppError from '@shared/error/AppError';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  token: string;
  user: User;
}

class CreateSessionService {
  constructor(private usersRepository: IUsersRepository) {}

  public async run({ email, password }: IRequestDTO): Promise<IResponseDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        status: 401,
        message: 'Invalid credentials.',
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError({
        status: 401,
        message: 'Invalid credentials.',
      });
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return {
      token,
      user,
    };
  }
}

export default CreateSessionService;
