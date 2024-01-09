import {
  Controller,
  Req,
  UseGuards,
  Get,
  Res,
  Delete,
  Param,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { Response, Request } from 'express';
import { PlaylistService } from '@database/playlist/playlist.service';
import { JwtAuthGuard } from '@auth/auth.guard';

@Controller('/user')
export class UserController {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private playlistService: PlaylistService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuthUser(@Req() req: any) {
    return await this.UserModel.findById(req.user._id, { password: 0 });
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
    await user.update({ $pull: { playlists: _id } });
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

  @Get('/change_passwords')
  remove() {
    return this.UserModel.find({}).then((users) => {
      return users.map((user) => {
        user.password = '123';
        return user.save();
      });
    });
  }
}
