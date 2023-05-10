import { HttpMethodEnum } from '../enums/http-method.enum.js';


const healthRoutes = async (fastify) => {
  fastify.route({
    method: HttpMethodEnum.GET,
    url: '/',
    handler: async (request, reply) => {
      return reply.code(200).send({ status: 'OK' });
    },
    schema: {
      summary: 'Health check',
      tags: ['Health'],
    },
  });
};

export {
  healthRoutes,
};
