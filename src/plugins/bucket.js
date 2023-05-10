import AWS from 'aws-sdk';

import { config } from '../config.js';


const bucketCredentials = new AWS.Credentials({
  accessKeyId: config.bucket.accessKey,
  secretAccessKey: config.bucket.secretKey,
});

const bucket = new AWS.S3({
  credentials: bucketCredentials,
});

export {
  bucket,
};
