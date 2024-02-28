import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import {
  CloudinaryResponse,
  CloudinaryDeleteResponse,
} from './cloudinary-response';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profiles' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  deleteFile(url: string): Promise<CloudinaryDeleteResponse> {
    return new Promise<CloudinaryDeleteResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(extractPublicId(url), (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
