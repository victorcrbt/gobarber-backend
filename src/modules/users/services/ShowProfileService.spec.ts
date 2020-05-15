import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/error/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show a users profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const findUser = await showProfile.run(user.id);

    expect(findUser.id).toBe(user.id);
    expect(findUser.name).toBe('John Doe');
    expect(findUser.email).toBe('john@email.com');
  });

  it('should throw an error if cannot find the user', async () => {
    try {
      await showProfile.run('non-existing-user');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User not found.');
    }
  });
});
