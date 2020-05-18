import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCachProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/error/AppError';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCachProvider;
let createUser: CreateUserService;
let createSession: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCachProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('it should be able to authenticate', async () => {
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
