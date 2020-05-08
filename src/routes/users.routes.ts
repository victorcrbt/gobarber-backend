import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const routes = Router();

routes.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();

    const user = await createUser.run({ name, email, password });

    delete user.password;

    return res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default routes;
