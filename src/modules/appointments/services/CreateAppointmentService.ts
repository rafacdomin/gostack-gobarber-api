import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Invalid appointment date');
    }

    if (user_id === provider_id) {
      throw new AppError('Invalid provider');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('Invalid appointment date');
    }

    const appointmentExists = await this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (appointmentExists) {
      throw new AppError('Appointment is already booked');
    }

    const appointment = await this.appointmentRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
