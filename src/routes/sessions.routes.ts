import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const routes = Router();

routes.post('/', async (req, res) => {
  const { email, password } = req.body;

  const createSession = new CreateSessionService();

  const { token, user } = await createSession.run({ email, password });

  delete user.password;

  return res.json({ token, user });
});

export default routes;
