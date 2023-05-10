import * as uploadService from '../services/upload.service.js';
import { HttpMethodEnum } from '../enums/http-method.enum.js';
import { UploadTypeEnum } from '../enums/upload-type.enum.js';
import { config } from '../config.js';


const uploadRoutes = async (fastify) => {
  fastify.route({
    method: HttpMethodEnum.POST,
    url: '/',
    handler: async (request, reply) => {
      const { type, file: [uploadedFile] } = request.body;
      const { data: fileData, filename, mimetype } = uploadedFile;

      if (!config.fileUpload.allowedMimeTypes.includes(mimetype)) {
        throw new Error('Mimetype is not allowed');
      }

      const { url } = await uploadService.upload({
        filename,
        mimetype,
        fileData,
        type,
      });

      return reply.code(200).send({ url });
    },
    schema: {
      summary: 'Upload file',
      tags: ['Upload'],
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['file', 'type'],
        properties: {
          file: { isFileType: true },
          type: {
            type: 'string',
            enum: Object.values(UploadTypeEnum),
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
          },
        },
      },
    },
  });
};

export {
  uploadRoutes,
};
