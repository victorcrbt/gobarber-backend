import { startOfHour } from 'date-fns';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCachProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/error/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCachProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCachProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it('shoud be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 14);

    const appointment = await createAppointment.run({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('provider_id', 'provider-id');
    expect(appointment).toHaveProperty('user_id', 'user-id');
    expect(appointment).toHaveProperty('date', startOfHour(date));
  });

  it('should create a notification when an appointment is created', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await createAppointment.run({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 14),
    });

    await createAppointment.run({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 17),
    });

    const notifications = await fakeNotificationsRepository.findAll();

    expect(notifications).toHaveLength(2);
    expect(notifications).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: notifications[0].id,
        }),
        expect.objectContaining({
          id: notifications[1].id,
        }),
      ])
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 14);

    await createAppointment.run({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date,
    });

    try {
      await createAppointment.run({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty('message', 'This time is already taken.');
    }
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    try {
      await createAppointment.run({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 11),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        "You can't book an appointment on a past date."
      );
    }
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 14);

    try {
      await createAppointment.run({
        provider_id: 'user-id',
        user_id: 'user-id',
        date,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        "You can't book an appointment with yourself."
      );
    }
  });

  it('should not be able to create an appointment before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.run({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 7),
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.run({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 18),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
