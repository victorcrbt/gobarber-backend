import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider
    );
  });

  it('should be able to recover the password using the user email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.run({
      email: 'john@email.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to able to recover the password if the user does not exists', async () => {
    try {
      await sendForgotPasswordEmail.run({
        email: 'john@email.com',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        'No user found for the provided email.'
      );
    }
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.run({
      email: 'john@email.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
