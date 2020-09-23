import { container } from 'tsyringe';

import IStorageProvider from './storageProvider/models/IStorageProvider';
import DiskStorageProvider from './storageProvider/implementations/DiskStorageProvider';

import IMailProvider from './mailProvider/models/IMailProvider';
import EtherealMailProvider from './mailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './mailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './mailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
