import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

const tempFolder = resolve(__dirname, '..', '..', 'temp');

export default {
  tempFolder,
  uploadsFolder: resolve(tempFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
