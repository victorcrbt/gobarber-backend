import { Router } from 'express';

import CreateSessionService from '@modules/users/services/CreateSessionService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const routes = Router();

routes.post('/', async (req, res) => {
  const { email, password } = req.body;

  const usersRepository = new UsersRepository();
  const createSession = new CreateSessionService(usersRepository);

  const { token, user } = await createSession.run({ email, password });

  delete user.password;

  return res.json({ token, user });
});

export default routes;
