import { Router } from 'express';
import { uuid } from 'uuidv4';

const routes = Router();

const appointments = [];

routes.post('/', (req, res) => {
  const { provider, date } = req.body;

  const appointment = {
    id: uuid(),
    provider,
    date,
  };

  appointments.push(appointment);

  return res.json(appointment);
});

export default routes;
