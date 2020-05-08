import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import AppError from '@shared/error/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async run({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError({
        status: 401,
        message: 'Only authenticated users can change the avatar.',
      });
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const fileExists = await fs.promises.stat(userAvatarFilePath);

      if (fileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user, { reload: true });

    return user;
  }
}

export default UpdateUserAvatarService;
