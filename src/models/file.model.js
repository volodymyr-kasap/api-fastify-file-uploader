import mongoose from 'mongoose';

import { UploadTypeEnum } from '../enums/upload-type.enum.js';


const fileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  bucket: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: UploadTypeEnum,
    required: true,
  },
  expiredAt: {
    type: Date,
    nullable: true,
  },
  deletedAt: {
    type: Date,
    nullable: true,
  },
}, { timestamps: true, collection: 'UploadedFile' });

const FileModel = mongoose.model('FileModel', fileSchema);

export {
  FileModel,
};
