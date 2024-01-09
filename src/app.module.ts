import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ArtistModule } from '@database/artist/artist.module';
import { MulterModuleConfig } from 'src/multer.module';
import { SongModule } from '@database/song/song.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from '@database/user/user.module';
import { PlaylistModule } from '@database/playlist/playlist.module';
import { AlbumModule } from '@database/album/album.module';

const { DATABASE } = process.env;

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/' + DATABASE),
    AuthModule,
    SongModule,
    AlbumModule,
    ArtistModule,
    UserModule,
    PlaylistModule,
    MulterModuleConfig(),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MulterModule],
})
export class AppModule {}
