/* eslint-disable no-plusplus */
import ListProviderMonthAvailability from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderMonthAvailability: ListProviderMonthAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    for (let i = 0; i < 10; i++) {
      fakeAppointmentsRepository.create({
        provider_id: 'user',
        user_id: '123123123',
        date: new Date(2020, 9, 5, i + 8, 0, 0),
      });
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123123',
      date: new Date(2020, 9, 6, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      month: 10,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 4, available: true },
        { day: 5, available: false },
        { day: 6, available: true },
        { day: 7, available: true },
      ]),
    );
  });
});
