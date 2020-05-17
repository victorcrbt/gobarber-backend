import { S3 } from 'aws-sdk';
import mime from 'mime';
import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3();
  }

  public async saveFile(file: string): Promise<string> {
    const originalFilePath = path.resolve(uploadConfig.tempFolder, file);

    const fileContent = await fs.promises.readFile(originalFilePath);

    const ContentType = mime.getType(originalFilePath);

    if (!ContentType) {
      throw new Error('File not found.');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalFilePath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
