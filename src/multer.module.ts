// import { MulterModule } from '@nestjs/platform-express';
// import { randomUUID } from 'crypto';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { v2 as cloudinaryV2 } from 'cloudinary';

// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
//   process.env;

// cloudinaryV2.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: cloudinaryV2,
//   params: {
//     public_id: () => randomUUID(),
//   },
// });

// export const MulterModuleConfig = () => {
//   return MulterModule.register({
//     storage: cloudinaryStorage,
//   });
// };
