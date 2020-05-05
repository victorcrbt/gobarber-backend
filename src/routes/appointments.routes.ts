import { Router } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

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

  const appointment = {
    id: uuid(),
    provider,
    date: parsedDate,
  };

  appointments.push(appointment);

  return res.json(appointment);
});

export default routes;
