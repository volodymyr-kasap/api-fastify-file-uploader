import { DateTime } from 'luxon';

import { bucket } from '../plugins/bucket.js';
import { FileModel } from '../models/file.model.js';


const removeAllFiles = async () => {
  const now = DateTime.now().toJSDate();

  console.log('removeAllFiles, start', now);

  const files = await FileModel.find({
    expiredAt: { $lt: now },
  });

  console.log('removeAllFiles, files count', files.length);

  if (!files?.length) {
    return;
  }

  const results = await Promise.allSettled(
    files.map(async (file) => {
      await bucket.deleteObject({
        Bucket: file.bucket,
        Key: file.key,
      }).promise();

      return file._id;
    }),
  );

  const fulfilled = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  const rejected = results.filter((r) => r.status === 'rejected').map((e) => e.reason);

  if (fulfilled.length > 0) {
    console.log('removeAllFiles, fulfilled count', fulfilled.length);
    await FileModel.updateMany({
      _id: { $in: fulfilled },
    }, {
      deletedAt: DateTime.now().toJSDate(),
    });
  }

  if (rejected.length > 0) {
    console.error(rejected);
  }
};

export {
  removeAllFiles,
};
