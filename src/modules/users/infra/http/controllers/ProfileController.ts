import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.run(user_id);

    delete user.password;

    return res.status(200).json(user);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, old_password, password } = req.body;

    const createUser = container.resolve(UpdateProfileService);

    const user = await createUser.run({
      user_id: req.user.id,
      name,
      email,
      old_password,
      password,
    });

    return res.status(200).json(classToClass(user));
  }
}
