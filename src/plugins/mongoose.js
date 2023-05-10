import mongoose from 'mongoose';

import { config } from '../config.js';


const initMongoose = async () => {
  try {
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error();
    throw error;
  }
};

export {
  initMongoose,
};
