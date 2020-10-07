import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class DayAvailabilityController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { day, month, year } = req.query;
    const provider_id = req.params.id;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDayAvailability.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return res.json(availability);
  }
}
