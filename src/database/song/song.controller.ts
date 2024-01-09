import {
  Controller,
  Req,
  UseGuards,
  Get,
  Param,
  Response,
  StreamableFile,
  HttpException,
  HttpStatus,
  Header,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song, SongDocument } from './song.schema';
import { Model } from 'mongoose';
import { Request, Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from '@auth/auth.guard';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';

@Controller('/song')
export class SongController {
  constructor(@InjectModel(Song.name) private SongModel: Model<SongDocument>) {}

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getSong(@Req() req: Request, @Param('id') id: string) {
    return await this.SongModel.findById(id)
      .populate({
        path: 'artist',
        select: 'name',
      })
      .populate({
        path: 'album',
        select: 'image small_image',
      });
  }

  @Get('/search/:query')
  async searchResult(
    @Param('query') query: string,
    @Query('cursor') cursor: string,
  ) {
    const regex = new RegExp('^' + query.replace(' ', '|'), 'i');
    const size = 10;
    return await this.SongModel.find({ title: regex })
      .populate({
        path: 'artist',
        select: 'name',
      })
      .populate({
        path: 'album',
        select: 'image small_image',
      })
      .sort({ $natural: 1 })
      .skip(+cursor * size)
      .limit(size);
    // .select('-lyrics')
  }
  // @UseGuards(JwtAuthGuard)
  @Get('/:id/audio')
  @Header('Content-Type', 'audio/*')
  getMP3Track(
    @Req() req: Request,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Param('id') id,
  ) {
    try {
      const path = join(process.cwd(), `src/media/songs/${id}.mp3`);
      const { size } = statSync(path);
      const { range } = req.headers;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const [partialstart, partialend] = parts;
        const start = parseInt(partialstart, 10);
        const end = partialend ? parseInt(partialend, 10) : size - 1;
        res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
        });
        const file = createReadStream(path, {
          start,
          end,
        });
        return new StreamableFile(file);
      } else {
        res.writeHead(200, { 'Content-Length': size });
        return new StreamableFile(createReadStream(path));
      }
    } catch {
      throw new HttpException('Track Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
