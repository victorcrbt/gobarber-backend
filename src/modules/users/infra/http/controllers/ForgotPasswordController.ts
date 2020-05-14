import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgoPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgoPasswordEmailService
    );

    await sendForgotPasswordEmail.run({ email });

    return res.status(204).json();
  }
}
