import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

const routes = Router();

routes.use(ensureAuthenticated);

// routes.get('/', async (req, res) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);

//   const appointments = await appointmentsRepository.find();

//   return res.json(appointments);
// });

routes.post('/', async (req, res) => {
  const { provider_id, date } = req.body;

  const parsedDate = parseISO(date);

  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.run({
    provider_id,
    date: parsedDate,
  });

  return res.status(201).json(appointment);
});

export default routes;
