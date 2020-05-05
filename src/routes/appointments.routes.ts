import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const routes = Router();

const appointmentsRepository = new AppointmentsRepository();

routes.get('/', (req, res) => {
  const appointments = appointmentsRepository.findAll();

  return res.json(appointments);
});

routes.post('/', (req, res) => {
  try {
    const { provider, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(
      appointmentsRepository
    );

    const appointment = createAppointment.run({
      provider,
      date: parsedDate,
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default routes;
