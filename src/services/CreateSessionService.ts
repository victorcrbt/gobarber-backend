import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

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
      throw new Error('Invalid credentials.');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials.');
    }

    const token = sign({}, 'e89da1c8c4c5dc3226f019977755644f', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      token,
      user,
    };
  }
}

export default CreateSessionService;
