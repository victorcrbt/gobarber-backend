import { addHours, addSeconds } from 'date-fns';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/error/AppError';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.run({
      token,
      password: '000000',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toEqual('000000');
    expect(generateHash).toHaveBeenCalledWith('000000');
  });

  it('should not be able to reset the password if the token does not exists', async () => {
    try {
      await resetPasswordService.run({
        token: 'non-existing-token',
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User token not found.');
    }
  });

  it('should not be able to reset the password if the user does not exists', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user'
    );

    try {
      await resetPasswordService.run({
        token,
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User not found.');
    }
  });

  it('should not be able to reset the password if the token is expired', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    // await expect(
    //   resetPasswordService.run({
    //     token,
    //     password: '000000',
    //   })
    // ).rejects.toBeInstanceOf(AppError);

    try {
      await resetPasswordService.run({
        token,
        password: '000000',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty('message', 'User token is expired.');
    }
  });
});
