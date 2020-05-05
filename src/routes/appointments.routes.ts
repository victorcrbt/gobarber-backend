import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

const routes = Router();

const appointments: Appointment[] = [];

routes.post('/', (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));
  const findAppointmentInSameHour = appointments.find(appointment =>
    isEqual(parsedDate, appointment.date)
  );

  if (findAppointmentInSameHour) {
    return res.status(403).json({ error: 'This time is already taken.' });
  }

  const appointment = new Appointment(provider, parsedDate);

  appointments.push(appointment);

  return res.json(appointment);
});

export default routes;
