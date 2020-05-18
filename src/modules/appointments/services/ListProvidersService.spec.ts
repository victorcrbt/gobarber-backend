import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCachProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCachProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCachProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it('should list all the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Schmoe',
      email: 'schmoe@email.com',
      password: '123456',
    });

    const providers = await listProviders.run({
      user_id: loggedUser.id,
    });

    expect(providers).toHaveLength(2);
    expect(providers).toStrictEqual([user1, user2]);
  });

  it('should return the cached providers list', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Schmoe',
      email: 'schmoe@email.com',
      password: '123456',
    });

    const providers = await listProviders.run({
      user_id: loggedUser.id,
    });

    await listProviders.run({
      user_id: loggedUser.id,
    });

    expect(providers).toHaveLength(2);
    expect(providers).toStrictEqual([user1, user2]);
  });
});
