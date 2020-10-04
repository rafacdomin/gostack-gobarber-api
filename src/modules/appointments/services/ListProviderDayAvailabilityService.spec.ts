/* eslint-disable no-plusplus */
import ListProviderDayAvailability from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderDayAvailability: ListProviderDayAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    for (let i = 0; i < 2; i++) {
      fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: '123123123',
        date: new Date(2020, 9, 5, i + 11, 0, 0),
      });
    }

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 5, 9).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      month: 10,
      year: 2020,
      day: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: true },
        { hour: 11, available: false },
        { hour: 12, available: false },
        { hour: 13, available: true },
        { hour: 14, available: true },
      ]),
    );
  });
});
