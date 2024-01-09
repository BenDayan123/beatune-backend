import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from './album.schema';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>,
  ) {}

  find(
    filter: FilterQuery<AlbumDocument>,
    update?: ProjectionType<AlbumDocument>,
  ) {
    return this.AlbumModel.find(filter, update);
  }

  async searchAlbums(
    query: FilterQuery<AlbumDocument>,
    cursor: number | string,
    limit: number,
  ) {
    return this.AlbumModel.find(query)
      .skip(+cursor * limit)
      .limit(limit);
  }
}
