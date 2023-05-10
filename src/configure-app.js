import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';

import { config } from './config.js';
import { uploadRoutes } from './routes/upload.routes.js';
import { healthRoutes } from './routes/health.routes.js';


const configureApp = async (app) => {
  app.register(multipart, {
    limits: {
      fileSize: config.fileUpload.maxFileSize,
      files: config.fileUpload.maxFileCount,
    },
    addToBody: true,
  });
  app.register(cors);
  app.register(helmet);

  if (config.isDevelop) {
    app.register(swagger);
    app.register(swaggerUI, {
      routePrefix: '/docs',
      swagger: {
        info: {
          title: 'Uploader',
        },
        host: config.server.host,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'Upload' },
          { name: 'Health' },
        ],
      },
    });
  }

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  app.register(uploadRoutes, { prefix: '/upload' });
  app.register(healthRoutes, { prefix: '/health' });
};

export {
  configureApp,
};
