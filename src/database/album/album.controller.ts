import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './album.schema';
import { Model } from 'mongoose';

@Controller('/albums')
export class AlbumController {
  constructor(
    @InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>,
  ) {}

  @Get('/:id')
  async getAlbums(@Param('id') id: string) {
    return this.AlbumModel.findById(id).select('-tracks').populate({
      path: 'artist',
      select: 'name profile',
    });
  }

  @Get('/:id/tracks')
  async getTracks(@Param('id') id: string) {
    const album = await this.AlbumModel.findById(id).populate({
      path: 'tracks',
      select: '-lyrics',
      populate: {
        path: 'album artist',
        select: 'image small_image name',
      },
    });
    if (!album?.tracks)
      throw new HttpException('Album not found', HttpStatus.BAD_REQUEST);
    return album.tracks;
  }
}
