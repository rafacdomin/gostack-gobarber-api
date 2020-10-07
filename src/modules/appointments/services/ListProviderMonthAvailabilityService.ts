import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonth({
      provider_id,
      month,
      year,
    });

    const numberOfDays = getDaysInMonth(new Date(year, month - 1));

    const eachDay = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1,
    );

    const availability = eachDay.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          appointmentsInDay.length < 10 && isAfter(compareDate, new Date()),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
