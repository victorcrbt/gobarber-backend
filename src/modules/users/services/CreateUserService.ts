import { getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/error/AppError';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async run({ name, email, password }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const emailAlreadyUsed = await userRepository.findOne({ where: { email } });

    if (emailAlreadyUsed) {
      throw new AppError({
        status: 400,
        message: 'The provided email is already in use.',
      });
    }

    const user = userRepository.create({ name, email, password });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
