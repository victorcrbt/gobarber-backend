import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const routes = Router();

const appointmentsRepository = new AppointmentsRepository();

routes.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const findAppointmentInSameHour = appointmentsRepository.findByDate(
    parsedDate
  );

  if (findAppointmentInSameHour) {
    return res.status(403).json({ error: 'This time is already taken.' });
  }

  const appointment = appointmentsRepository.create(provider, parsedDate);

  return res.json(appointment);
});

export default routes;
