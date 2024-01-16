import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@database/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ArtistModule } from '@database/artist/artist.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

const { JWT_KEY } = process.env;

@Module({
  imports: [
    UserModule,
    CloudinaryModule,
    // ArtistModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CloudinaryService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
