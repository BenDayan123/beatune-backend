import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '@auth/auth.guard';
import { ArtistService } from '@database/artist/artist.service';
import { SongService } from '@database/song/song.service';
import { Request } from 'express';
import { UserService } from '@database/user/user.service';
import { PlaylistService } from '@database/playlist/playlist.service';
import { AlbumService } from '@database/album/album.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private artistService: ArtistService,
    private userService: UserService,
    private playlistService: PlaylistService,
    private songService: SongService,
    private albumService: AlbumService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/search/:query')
  async searchResult(
    @Param('query') query: string,
    @Query('types') types?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    const regex = { $regex: `^${query}`, $options: 'i' };
    const wantedModels =
      types && types !== 'all'
        ? types.split(',')
        : ['songs', 'artists', 'albums'];
    const searches = {
      artists: this.artistService.searchArtists(
        { name: regex },
        cursor,
        limit || 10,
      ),
      albums: this.albumService.searchAlbums(
        { name: regex },
        cursor,
        limit || 10,
      ),
      songs: this.songService.searchSongs(
        { title: regex },
        cursor,
        limit || 10,
      ),
      playlists: this.playlistService.searchPlaylists(
        { name: regex },
        cursor,
        limit || 10,
      ),
      users: this.userService.searchUsers(
        { username: regex },
        cursor,
        limit || 10,
      ),
    };
    const filtered = Object.fromEntries(
      Object.entries(searches).filter(([key]) => wantedModels.includes(key)),
    );
    const names = Object.keys(filtered);
    const values = await Promise.all(Object.values(filtered));
    const result = Object.assign(
      {},
      ...names.map((k, i) => values[i].length != 0 && { [k]: values[i] }),
    );
    return values.every((v) => v.length === 0) ? 'null' : result;
  }

  @Get('/search/options/:query')
  async getQueryOptions(@Param('query') query: string) {
    const regex = new RegExp(`.*${query}.*`, 'gmi');
    // const regex = { $regex: `^${query}`, $options: 'i' };
    const size = 3;
    const artists = await this.artistService
      .find({ name: regex })
      .select('name -_id')
      .limit(size);
    const songs = await this.songService
      .find({ title: regex })
      .select('title -_id')
      .limit(size);
    const albums = await this.albumService
      .find({ name: regex })
      .select('name -_id')
      .limit(size);
    return [
      ...artists.map((artist) => artist.name),
      ...songs.map((song) => song.title),
      ...albums.map((album) => album.name),
    ];
  }
}
