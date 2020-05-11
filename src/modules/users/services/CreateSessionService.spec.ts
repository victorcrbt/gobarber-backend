import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

describe('CreateSession', () => {
  it('it should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.run({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const response = await createSession.run({
      email: 'john@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with an email that does not exist', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );

    try {
      await createSession.run({
        email: 'john@email.com',
        password: '123456',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'Invalid credentials.');
    }
  });

  it('should not be able to authenticate with a incorrect password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.run({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    try {
      await createSession.run({
        email: 'john@email.com',
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'Invalid credentials.');
    }
  });
});
