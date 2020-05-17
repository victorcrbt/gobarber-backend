import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

const tempFolder = resolve(__dirname, '..', '..', 'temp');

interface IUploadConfig {
  driver: 'disk' | 's3';
  tempFolder: string;
  uploadsFolder: string;

  multer: {
    storage: multer.StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.APP_STORAGE_DRIVER,

  tempFolder,
  uploadsFolder: resolve(tempFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,
      filename(req, file, cb) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return cb(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.APP_BUCKET_NAME,
    },
  },
} as IUploadConfig;
