import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const MulterModuleConfig = () => {
  return MulterModule.register({
    storage: diskStorage({
      destination: './src/media',
      filename: (_, file, callback) => {
        const filetype = extname(file.originalname);
        callback(null, `${randomUUID()}${filetype}`);
      },
    }),
  });
};
