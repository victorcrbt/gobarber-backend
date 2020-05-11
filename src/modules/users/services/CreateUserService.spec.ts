import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/error/AppError';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.run({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'John Doe');
    expect(user).toHaveProperty('email', 'john@email.com');
  });

  it('should not be able to create more than one user with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.run({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    try {
      await createUser.run({
        name: 'John Doe',
        email: 'john@email.com',
        password: '123456',
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
});
