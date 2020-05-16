import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class PovidersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const loggedUserId = req.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const appointment = await listProviders.run({
      user_id: loggedUserId,
    });

    return res.status(201).json(appointment);
  }
}
