import Fastify from 'fastify';

import { config } from './config.js';
import { configureApp } from './configure-app.js';
import { ajvPlugin } from './plugins/ajv.js';
import { initMongoose } from './plugins/mongoose.js';
import { initCron } from './plugins/cron.js';


const serve = async () => {
  try {
    const app = Fastify({
      logger: true,
      ajv: {
        plugins: [
          ajvPlugin,
        ],
      },
    });

    await configureApp(app);
    await initMongoose();

    await app.ready();
    await app.listen({ port: config.server.port, host: config.server.host });
    await initCron();
  } catch (error) {
    console.error(error);
  }
};

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});

serve();
