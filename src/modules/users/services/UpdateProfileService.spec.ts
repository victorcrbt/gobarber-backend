import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/error/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'jane@email.com',
    });

    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('jane@email.com');
  });

  it('should not be able to change the email to an email already used', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane@email.com',
      password: '123456',
    });

    try {
      await updateProfile.run({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'john@email.com',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        'The provided email is already in use.'
      );
    }
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'jane@email.com',
      old_password: '123456',
      password: '000000',
    });

    expect(updatedUser.password).toBe('000000');
  });

  it('should not be able to update the password if the old password is not provided', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    try {
      await updateProfile.run({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'jane@email.com',
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        'You must provide the old password to be able to update the password.'
      );
    }
  });

  it('should not be able to update the password if the old password is incorrect', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    try {
      await updateProfile.run({
        user_id: user.id,
        name: 'Jane Doe',
        email: 'jane@email.com',
        old_password: '123123',
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'The old password is incorrect.');
    }
  });
});
