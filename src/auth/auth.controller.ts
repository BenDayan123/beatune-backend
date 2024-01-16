import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '@database/user/user.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUser } from '@database/user/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import * as bcrypt from 'bcryptjs';

const { GEN_SALT } = process.env;

@Controller('/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/user/signup')
  @UseInterceptors(FileInterceptor('profile'))
  async register(
    @UploadedFile() profile: Express.Multer.File,
    @Body() body: IUser,
  ) {
    const vaildedUser = await this.userService.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!vaildedUser) {
      const uploadedProfile = await this.cloudinaryService.uploadFile(profile);
      const user = await this.userService.createUser({
        ...body,
        password: bcrypt.hashSync(body.password, +GEN_SALT),
        profile: uploadedProfile.url,
      });
      return this.authService.login(user);
    } else throw new UnauthorizedException('The user already exist...');
  }

  @Post('/user/login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body);
    if (user) {
      return this.authService.login(user);
    } else
      throw new UnauthorizedException('Username or password are incorrect!');
  }
}
