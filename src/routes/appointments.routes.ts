import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const routes = Router();

routes.get('/', async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  return res.json(appointments);
});

routes.post('/', async (req, res) => {
  try {
    const { provider, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.run({
      provider,
      date: parsedDate,
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default routes;
