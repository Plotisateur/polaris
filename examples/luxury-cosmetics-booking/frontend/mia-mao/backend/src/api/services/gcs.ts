import { Storage } from '@google-cloud/storage';
import config from '../../config';

export async function getGCSFile(bucket: string, fileName: string) {
  const storage = new Storage();
  const myBucket = storage.bucket(bucket);
  const file = myBucket.file(fileName);
  const [content] = await file.download();

  return content;
}

export async function getSignedUrl(bucket: string, fileName: string) {
  const storage = new Storage();

  try {
    const storageRes = await storage
      .bucket(bucket)
      .file(fileName)
      .getSignedUrl({
        responseDisposition: 'attachment',
        version: 'v4',
        action: 'read',
        expires: Date.now() + 120 * 60 * 1000,
      });

    return storageRes[0];
  } catch {
    return '';
  }
}

export async function getGCSRCFile<T>(fileName: string) {
  const storage = new Storage();
  const myBucket = storage.bucket(config.appGcpOptimizerRCGcs as string);
  const file = myBucket.file(fileName);
  const [content] = await file.download();
  return JSON.parse(content.toString()) as T;
}
