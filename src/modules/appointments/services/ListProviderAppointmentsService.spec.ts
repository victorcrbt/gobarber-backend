import AppError from '@shared/error/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the appointments of a specific day', async () => {
    const provider_id = 'provider-id';
    const user_id = 'user-id';

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    const availability = await listProviderAppointments.run({
      provider_id,
      day: 20,
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual([appointment1, appointment2, appointment3]);
  });
});
