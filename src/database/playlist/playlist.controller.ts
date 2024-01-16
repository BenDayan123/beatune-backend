import {
  Controller,
  Req,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  Res,
  Body,
  Query,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist, PlaylistDocument } from './playlist.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { AddTrackModel, TracksUrlsModel } from './vaildations/add-track.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('/playlist')
export class PlaylistController {
  constructor(
    @InjectModel(Playlist.name) private PlaylistModel: Model<PlaylistDocument>,
    private userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPlaylist(
    @Param('id') _id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const playlist = await this.PlaylistModel.findOne({ _id }).populate({
      path: 'tracks',
      select: '-lyrics',
      populate: {
        path: 'album artist',
        select: 'image small_image name',
      },
    });
    if (playlist) {
      if (playlist.privacy == 'public' || playlist.user === req.user['_id'])
        return res.json(playlist);
      throw new HttpException(
        "You don't have access to this playlist...",
        HttpStatus.FORBIDDEN,
      );
    }
    return res.sendStatus(404);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async changeDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
    @Param('id') _id: string,
  ) {
    const playlist = await this.PlaylistModel.findOne({
      _id,
      user: req.user['_id'],
    });
    if (playlist) {
      playlist.update(body, {}, (err, doc) => {
        if (err) throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        else res.json(doc);
      });
    } else {
      throw new HttpException(
        "You don't have access to this playlist...",
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/')
  async getPlaylists(@Req() req: Request, @Res() res: Response) {
    const userID = req.user['_id'];
    const playlists = await this.PlaylistModel.find({
      user: userID,
      privacy: 'public',
    }).select('name image _id');
    res.json(playlists);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/tracks')
  async addTracks(
    @Req() req: Request,
    @Body() body: TracksUrlsModel,
    @Param('id') _id: string,
    @Query() { position }: AddTrackModel,
  ) {
    const { tracks } = await this.PlaylistModel.findOneAndUpdate(
      { _id, user: req.user['_id'] },
      { $push: { tracks: { $each: body.tracks, $position: position } } },
      { new: true },
    ).populate({
      path: 'tracks',
      select: '-lyrics',
      populate: {
        path: 'album artist',
        select: 'image small_image name',
      },
    });
    return { tracks };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/tracks')
  async deleteTracks(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: TracksUrlsModel,
    @Param('id') _id: string,
  ) {
    const { tracks } = body;
    const userID = req.user['_id'];
    const playlist = await this.PlaylistModel.findById(_id);
    // const playlist = await this.PlaylistModel.findOneAndUpdate(
    //   { _id },
    //   byIndex && { $pull: { songs: { $in: tracks } } },
    // );
    if (playlist) {
      if (playlist.user == userID) {
        playlist.tracks = playlist.tracks.filter((_, i) => !tracks.includes(i));
        await playlist.save();
        return res.json({ deletedTracks: tracks });
      } else
        throw new HttpException(
          "You don't have access to this playlist...",
          HttpStatus.FORBIDDEN,
        );
    }
    return res.sendStatus(404);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/tracks')
  async getTracks(@Res() res: Response, @Param('id') _id: string) {
    const playlist = await this.PlaylistModel.findById(_id).populate({
      path: 'tracks',
      select: '-lyrics',
      populate: {
        path: 'album artist',
        select: 'image small_image name',
      },
    });

    if (playlist) return playlist?.tracks ?? [];
    return res.sendStatus(404);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createPlaylist(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userID = req.user['_id'];
    const uploadedImage = await this.cloudinaryService.uploadFile(image);
    const playlist = await this.PlaylistModel.create({
      ...req.body,
      image: uploadedImage.url,
      user: userID,
    });
    await this.userService.findOneAndUpdate(
      { _id: userID },
      { $push: { playlists: playlist._id } },
      { new: true },
    );
    return playlist;
  }
}
