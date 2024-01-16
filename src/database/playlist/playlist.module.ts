import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IPlaylist,
  Playlist,
  PlaylistDocument,
  PlaylistSchema,
} from './playlist.schema';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { UserModule } from '@database/user/user.module';
import { unlink } from 'fs';
import { join } from 'path';
import { CallbackWithoutResultAndOptionalError } from 'mongoose';
import { SongModule } from '@database/song/song.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

function removeFiles(next: CallbackWithoutResultAndOptionalError) {
  const playlist = this;
  next();
  // unlink(join(mediaURL, playlist.image), (err) => {
  //   if (err) return console.error(err);
  //   next();
  // });
}

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Playlist.name,
        useFactory: () => {
          const schema = PlaylistSchema;
          schema.pre<PlaylistDocument>(
            'deleteOne',
            { document: true },
            removeFiles,
          );
          return schema;
        },
      },
    ]),
    forwardRef(() => UserModule),
    // SongModule,
    CloudinaryModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
