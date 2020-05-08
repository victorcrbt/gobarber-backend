import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

import authConfig from '../config/auth';
import AppError from '../error/AppError';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  token: string;
  user: User;
}

class CreateSessionService {
  public async run({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

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
