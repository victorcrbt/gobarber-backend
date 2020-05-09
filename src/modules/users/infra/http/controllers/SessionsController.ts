import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const createSession = container.resolve(CreateSessionService);

    const { token, user } = await createSession.run({ email, password });

    delete user.password_hash;

    return res.json({ token, user });
  }
}
