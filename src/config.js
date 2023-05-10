import 'dotenv/config';
import fs from 'node:fs';

import { parse } from 'dotenv';

import { NodeEnvEnum } from './enums/node-env.enum.js';
import { MimetypeEnum } from './enums/mimetype.enum.js';


class Config {
  #envFiles = ['.env', '.env.local'];
  #envProvider = {};

  constructor () {
    this.#envFiles.map((fileName) => {
      if (fs.existsSync(fileName)) {
        Object.assign(this.#envProvider, parse(fs.readFileSync(fileName)));
      }
    });
  }

  get (key) {
    if (key in this.#envProvider) return this.#envProvider[key];
    else throw new Error(`Environment variable ${key} is not defined`);
  }

  getNumber (key) {
    return Number(this.get(key));
  }

  get isProduction () {
    return this.nodeEnv === NodeEnvEnum.production;
  }

  get isDevelop () {
    return this.nodeEnv === NodeEnvEnum.develop;
  }

  get server () {
    return {
      host: this.get('SERVER_HOST'),
      port: this.getNumber('SERVER_PORT'),
    };
  }

  get nodeEnv () {
    const nodeEnv = this.get('NODE_ENV');

    if (!Object.values(NodeEnvEnum).includes(nodeEnv)) {
      throw new Error(`Environment variable NODE_ENV must be one of ${Object.values(NodeEnvEnum).join(',')}`);
    }

    return nodeEnv;
  }

  get mongoUrl () {
    return this.get('MONGO_URL');
  }

  get bucket () {
    return {
      s3Front: this.get('BUCKET_FRONT'),
      s3Endpoint: this.get('BUCKET_ENDPOINT'),
      accessKey: this.get('BUCKET_ACCESS_KEY'),
      secretKey: this.get('BUCKET_SECRET_KEY'),
      fileTTL: this.get('BUCKET_FILE_TTL'),
    };
  }

  get fileUpload () {
    return {
      maxFileSize: 1048576,
      maxFileCount: 1,
      allowedMimeTypes: Object.values(MimetypeEnum),
    };
  }

  get garbage () {
    return {
      cron: this.get('GARBAGE_CRON'),
    };
  }
}

const config = new Config();

export { config };
