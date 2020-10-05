import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErros';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, new Date(Date.now()))) {
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

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${format(
        appointmentDate,
        "dd/MM/yyyy 'às' HH:mm'h'",
      )}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
