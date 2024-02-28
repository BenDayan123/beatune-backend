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
  }

  @Get('/genre/top-artist')
  async topArtistsPerGenre() {
    const results = await this.ArtistModel.aggregate([
      {
        $unwind: '$genres',
      },
      {
        $group: {
          _id: '$genres',
          topArtists: {
            $push: {
              name: '$name',
              popularity: '$popularity',
            },
          },
        },
      },
      {
        $sort: {
          popularity: 1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    return results;
  }
}
