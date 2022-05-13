import s3, { Bucket } from "../../integrations/s3";
import { v4 as uuid } from 'uuid';
import mime from 'mime-types';

export const PREFIX = `https://${Bucket}.s3.amazonaws.com/`;

export const createTarget = async (
  mimeType: string
) => {

  const filename = encodeURIComponent(`${uuid()}.${mime.extension(mimeType)}`);
  const params = {
    Bucket,
    Key: filename,
    Expires: 60,
    ContentType: mimeType,
    ACL: 'public-read',
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    const url = `${PREFIX}${filename}`;
    return { signedUrl, url };
  } catch (err) {
    return undefined; 
  }
};

export const verifyUpload = async (url: string) => {
  const Key = url.replace(PREFIX, '');

  const exists = await s3.getObject({
    Bucket,
    Key,
  }).promise().then(
    (object) => {
      if (object.Body instanceof Buffer) return object.Body;

      return undefined;
    },
    (err) => {
      if (err.code === 'NotFound') return undefined;
      throw err;
    }
  );

  return exists;
}

export const deleteUpload = async (url: string) => {
  const Key = url.replace(PREFIX, '');

  await s3.deleteObject({
    Bucket,
    Key,
  });
}