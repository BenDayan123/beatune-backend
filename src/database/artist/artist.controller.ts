import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from './artist.schema';
import { Model } from 'mongoose';
import { AlbumService } from '@database/album/album.service';
// import { JwtAuthGuard } from '@auth/auth.guard';
// import { Request } from 'express';
// import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/artist')
export class ArtistController {
  constructor(
    @InjectModel(Artist.name) private ArtistModel: Model<ArtistDocument>,
    private AlbumService: AlbumService,
  ) {}

  @Get('/:id')
  async getArtist(@Param('id') id: string) {
    return await this.ArtistModel.findById(id);
  }

  @Get('/:id/albums')
  async getAlbums(@Param('id') id: string) {
    return this.AlbumService.find({ artist_id: id }).select(
      '-tracks -artist_id',
    );
    // .populate({
    //   path: 'tracks',
    //   select: '-lyrics',
    // });
  }

  // @Post('/all')
  // @UseInterceptors(FileInterceptor('data'))
  // async createArtists(@UploadedFile() data: Express.Multer.File) {
  //   const artists = JSON.parse(data.buffer.toString());
  //   artists.map(async (artist) => {
  //     await this.ArtistModel.updateOne(
  //       { name: artist.name },
  //       { streams: artist.streams },
  //     );
  //   });
  //   for (let i = 0; i < artists.length; i++) {
  //     const { songs, ...rest } = artists[i];
  //     const artist = await this.ArtistModel.create(rest);
  //     const new_songs: any = songs.map((song) => ({
  //       ...song,
  //       artist_id: artist._id,
  //     }));
  //     const docs_songs = await this.songService.insertMany(new_songs);
  //     artist.songs = docs_songs;
  //     artist.save();
  //   }
  //   return 'GOOD!';
  // }
}
