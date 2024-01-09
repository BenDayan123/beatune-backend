import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from './artist.schema';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private ArtistModel: Model<ArtistDocument>,
  ) {}
  find(
    filter: FilterQuery<ArtistDocument>,
    update?: ProjectionType<ArtistDocument>,
  ) {
    return this.ArtistModel.find(filter, update);
  }

  async searchArtists(
    query: FilterQuery<ArtistDocument>,
    cursor: number | string,
    limit: number,
  ) {
    return this.ArtistModel.find(query)
      .skip(+cursor * limit)
      .limit(limit);
  }
}
