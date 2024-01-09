import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISong, Song, SongDocument } from './song.schema';

@Injectable()
export class SongService {
  constructor(@InjectModel(Song.name) private SongModel: Model<SongDocument>) {}

  async insertMany(songs: ISong[]) {
    return await this.SongModel.insertMany(songs);
  }
  find(
    filter: FilterQuery<SongDocument>,
    update?: ProjectionType<SongDocument>,
  ) {
    return this.SongModel.find(filter, update);
  }

  async searchSongs(
    query: FilterQuery<SongDocument>,
    cursor: number | string,
    limit: number,
  ) {
    return (
      this.SongModel.find(query)
        .select('-lyrics')
        .populate({
          path: 'artist',
          select: 'name',
        })
        .populate({
          path: 'album',
          select: 'image small_image',
        })
        .sort({ title: 'asc' })
        // .select('-lyrics')
        .skip(+cursor * limit)
        .limit(limit)
    );
  }
}
