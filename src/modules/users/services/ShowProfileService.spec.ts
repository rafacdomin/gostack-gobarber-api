import AppError from '@shared/errors/AppErros';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const userProfile = await showProfile.execute(user.id);

    expect(userProfile.name).toBe('John Doe');
    expect(userProfile.email).toBe('johndoe@email.com');
  });

  it('should not be able to show profile of an non-existent user', async () => {
    await expect(
      showProfile.execute('non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
