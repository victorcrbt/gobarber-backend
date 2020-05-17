/* eslint-disable no-nested-ternary */
import { container, InjectionToken } from 'tsyringe';

import mailConfig from '@config/mail';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import MailtrapProvider from './MailProvider/implementations/MailtrapProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
);

let MailProvider: InjectionToken<IMailProvider>;

switch (mailConfig.driver) {
  case 'ses': {
    MailProvider = SESMailProvider;
    break;
  }
  case 'ethereal': {
    MailProvider = EtherealMailProvider;
    break;
  }
  default: {
    MailProvider = MailtrapProvider;
  }
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(MailProvider)
);
