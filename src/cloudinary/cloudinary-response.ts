// cloudinary-response.ts
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  DeleteApiResponse,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
export type CloudinaryDeleteResponse = DeleteApiResponse;
