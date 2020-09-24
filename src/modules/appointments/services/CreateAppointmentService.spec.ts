import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppErros';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it(' should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '1234556677',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234556677');
  });

  it(' should not be able two appointments witg the same date', async () => {
    const date = new Date(2020, 4, 10, 11);

    await createAppointmentService.execute({
      date,
      provider_id: '1234556677',
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: '1234556677',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
