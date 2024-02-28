import {
  Controller,
  Req,
  UseGuards,
  Get,
  Res,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { Response, Request } from 'express';
import { PlaylistService } from '@database/playlist/playlist.service';
import { JwtAuthGuard } from '@auth/auth.guard';
import { SongService } from '@database/song/song.service';

@Controller('/user')
export class UserController {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private songService: SongService,
    private playlistService: PlaylistService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuthUser(@Req() req: any) {
    return await this.UserModel.findById(req.user._id, {
      password: 0,
      playlists: 0,
      favoriteSongs: 0,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/playlist/:id')
  async deletePlaylist(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') _id: string,
  ) {
    if (!Types.ObjectId.isValid(_id)) return res.sendStatus(422);
    const userID = req.user['_id'];
    const user = await this.UserModel.findOne({
      _id: userID,
      playlists: { $in: _id },
    });
    if (!user) return res.sendStatus(403);
    await user.updateOne({ $pull: { playlists: _id } });
    const data = await this.playlistService.remove(_id);
    return res.json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/playlists')
  async getPlaylists(@Req() req: Request, @Res() res: Response) {
    const userID = req.user['_id'];

    const { playlists } = await (
      await this.UserModel.findById(userID)
    ).populate({
      path: 'playlists',
      select: '-tracks',
    });
    return res.json(playlists);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorite-songs')
  async getFavoriteSong(@Req() req: Request) {
    const userID = req.user['_id'];
    const user = await this.UserModel.findById(userID).populate({
      path: 'favoriteSongs',
      select: '-lyrics',
      populate: {
        path: 'album artist',
        select: 'image small_image name',
      },
    });
    return user.favoriteSongs;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/favorite-songs/:id')
  async addFavoriteSong(@Req() req: Request, @Param('id') songID: string) {
    const userID = req.user['_id'];
    return this.songService.addFavoriteSong(userID, songID);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/favorite-songs/:id')
  async removeFavoriteSong(@Req() req: Request, @Param('id') songID: string) {
    const userID = req.user['_id'];
    return this.songService.removeFavoriteSong(userID, songID);
  }
}
