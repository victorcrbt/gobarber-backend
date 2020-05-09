import { Router } from 'express';
import { container } from 'tsyringe';

import CreateSessionService from '@modules/users/services/CreateSessionService';

const routes = Router();

routes.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createSession = container.resolve(CreateSessionService);

  const { token, user } = await createSession.run({ email, password });

  delete user.password;

  return res.json({ token, user });
});

export default routes;
