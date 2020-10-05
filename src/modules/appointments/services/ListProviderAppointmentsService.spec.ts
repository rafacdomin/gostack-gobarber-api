/* eslint-disable no-plusplus */
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointments from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAppointments: ListProviderAppointments;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointments(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 5, 11, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 9, 5, 12, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      month: 10,
      year: 2020,
      day: 5,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
