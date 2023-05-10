import { randomUUID } from 'node:crypto';

import { DateTime } from 'luxon';

import { config } from '../config.js';
import { bucket } from '../plugins/bucket.js';
import { UploadTypeEnum } from '../enums/upload-type.enum.js';
import { NodeEnvEnum } from '../enums/node-env.enum.js';
import { FileModel } from '../models/file.model.js';


const awsS3UploadPath = {
  [UploadTypeEnum.CLIENT_DOCUMENT]: 'client/documents',
  [UploadTypeEnum.ARTICLE]: 'article',
  [UploadTypeEnum.LOCATION]: 'location',
};

const aws3EnvUploadPath = {
  [NodeEnvEnum.production]: 'p',
  [NodeEnvEnum.develop]: 'd',
};

const getFileExtension = (filename) => filename.split('.')[1].toLowerCase();

const getUploadPath = (originalFilename, uploadType) => {
  const awsS3Path = awsS3UploadPath[uploadType];

  if (!awsS3Path) {
    throw new Error('upload type is undefined');
  }

  const filename = randomUUID();
  const extension = getFileExtension(originalFilename);

  return `${aws3EnvUploadPath[config.nodeEnv]}/${awsS3Path}/${filename}.${extension}`;
};

const upload = async ({ filename, type, mimetype, fileData }) => {
  const key = getUploadPath(filename, type);
  const bucketEndpoint = config.bucket.s3Endpoint;

  try {
    await bucket.upload({
      Bucket: bucketEndpoint,
      Body: fileData,
      Key: key,
      ContentType: mimetype,
    }).promise();
  } catch (error) {
    console.error(error);
    throw error;
  }

  const url = `${config.bucket.s3Front}/${key}`;
  const expiredAt = DateTime.now().plus({ seconds: config.bucket.fileTTL }).toJSDate();

  try {
    await new FileModel({
      url,
      bucket: bucketEndpoint,
      key,
      type,
      expiredAt,
    }).save();
  } catch (error) {
    console.error(error);
    throw error;
  }

  return {
    url,
  };
};


export {
  upload,
};
