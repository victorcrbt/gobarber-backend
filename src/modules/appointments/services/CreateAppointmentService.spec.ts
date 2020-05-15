import { startOfHour } from 'date-fns';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/error/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );
  });

  it('shoud be able to create a new appointment', async () => {
    const date = new Date();

    const appointment = await createAppointment.run({
      provider_id: '1a2b3c4d',
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id', '1a2b3c4d');
    expect(appointment).toHaveProperty('date', startOfHour(date));
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.run({
      provider_id: '1a2b3c4d',
      date: appointmentDate,
    });

    expect(
      createAppointment.run({
        provider_id: '1a2b3c4d',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
