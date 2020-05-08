import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

import AppError from '../error/AppError';

interface RequestDTO {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async run({ date, provider_id }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameHour = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameHour) {
      throw new AppError({
        status: 400,
        message: 'This time is already taken.',
      });
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
