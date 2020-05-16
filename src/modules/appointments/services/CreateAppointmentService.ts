import { startOfHour, isBefore, isAfter, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import AppError from '@shared/error/AppError';

interface IRequestDTO {
  date: Date;
  provider_id: string;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async run({
    date,
    user_id,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError({
        status: 400,
        message: "You can't book an appointment with yourself.",
      });
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError({
        status: 400,
        message: 'You can only create an appointment between 8am and 5pm.',
      });
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError({
        status: 400,
        message: "You can't book an appointment on a past date.",
      });
    }

    const findAppointmentInSameHour = await this.appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameHour) {
      throw new AppError({
        status: 400,
        message: 'This time is already taken.',
      });
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
