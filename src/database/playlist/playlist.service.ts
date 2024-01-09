import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private PlaylistModel: Model<PlaylistDocument>,
  ) {}
  async remove(_id: string) {
    const playlist = await this.PlaylistModel.findById({ _id });
    return playlist.deleteOne();
  }
  async searchPlaylists(
    query: FilterQuery<PlaylistDocument>,
    cursor: number | string,
    limit: number,
  ) {
    // { name: query, privacy: 'public' }
    return this.PlaylistModel.find(query)
      .skip(+cursor * limit)
      .limit(limit);
  }
}
