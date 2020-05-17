import { IMailContact } from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';

interface IMailDefaults {
  from: IMailContact;
}

interface IMailConfig {
  driver: 'mailtrap' | 'ethereal' | 'ses';
  defaults: IMailDefaults;
}

export default {
  driver: process.env.APP_MAIL_DRIVER || 'mailtrap',

  defaults: {
    from: {
      email: 'oi@victorbatalha.dev',
      name: 'Victor Batalha',
    },
  },
} as IMailConfig;
