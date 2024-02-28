import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISong, Song, SongDocument } from './song.schema';
import { UserService } from '@database/user/user.service';

@Injectable()
export class SongService {
  constructor(
    @InjectModel(Song.name) private SongModel: Model<SongDocument>,
    private UserService: UserService,
  ) {}

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

  async addFavoriteSong(userId: string, songId: string): Promise<Song | null> {
    const track = await this.SongModel.findById(songId)
      .select('-lyrics')
      .populate({
        path: 'artist',
        select: 'name',
      })
      .populate({
        path: 'album',
        select: 'image small_image',
      });
    if (!track) {
      return null;
    }

    const user = await this.UserService.findOne({ _id: userId });
    await user.updateOne({ $addToSet: { favoriteSongs: songId } });
    return track;
  }

  async removeFavoriteSong(userId: string, songId: string) {
    const user = await this.UserService.findOne({ _id: userId });
    await user.updateOne({ $pull: { favoriteSongs: songId } });
    return songId;
  }
}
