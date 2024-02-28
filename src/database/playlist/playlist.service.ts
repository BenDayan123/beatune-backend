import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private PlaylistModel: Model<PlaylistDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async remove(_id: string) {
    const playlist = await this.PlaylistModel.findById({ _id });
    await this.cloudinaryService.deleteFile(playlist.image);
    return playlist.deleteOne();
  }
  async searchPlaylists(
    query: FilterQuery<PlaylistDocument>,
    cursor: number | string,
    limit: number,
  ) {
    return this.PlaylistModel.find(query)
      .skip(+cursor * limit)
      .limit(limit);
  }
}
