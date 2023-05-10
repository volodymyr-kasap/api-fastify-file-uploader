import cron from 'node-cron';

import * as garbageService from '../services/garbage.service.js';
import { config } from '../config.js';


const initCron = async () => {
  const isValid = cron.validate(config.garbage.cron);

  if (!isValid) {
    console.log('cron is not valid', config.garbage.cron);
  }

  await garbageService.removeAllFiles();
  await cron.schedule(config.garbage.cron, garbageService.removeAllFiles);
};

export {
  initCron,
};
