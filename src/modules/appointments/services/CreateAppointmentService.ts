import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

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
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
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

    const isPastDate = isBefore(appointmentDate, Date.now());

    if (isPastDate) {
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

    const formmatedDate = format(
      appointmentDate,
      "'dia' dd/MM/yyyy 'às' HH:mm"
    );

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${formmatedDate}.`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
