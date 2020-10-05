import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppErros';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 9, 4, 13),
      provider_id: '1234556677',
      user_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234556677');
  });

  it('should not be able to create two appointments with the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 5, 12).getTime();
    });

    const date = new Date(2020, 10, 5, 14, 0, 0);

    await createAppointmentService.execute({
      date,
      user_id: 'user',
      provider_id: 'provider',
    });

    await expect(
      createAppointmentService.execute({
        date,
        user_id: 'user2',
        provider_id: 'provider2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 9, 4, 10),
        user_id: '123123123',
        provider_id: '1234556677',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments with yourself', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 9, 4, 13),
        user_id: 'user',
        provider_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments before 8am or after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12, 0, 0).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 9, 5, 7),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 9, 5, 18),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
