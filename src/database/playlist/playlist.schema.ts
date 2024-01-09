import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as schema } from 'mongoose';
import { User } from '@database/user/user.schema';
import { Song } from '@database/song/song.schema';

export type PlaylistDocument = Playlist & Document;

type PrivacyType = 'public' | 'private' | 'unlisted';

export interface IPlaylist {
  name: string;
  privacy: PrivacyType;
  image?: string;
  description?: string;
  tracks: Types.ObjectId[];
  user: Types.ObjectId;
}

@Schema({ collection: 'playlists' })
export class Playlist {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([{ type: schema.Types.ObjectId, ref: 'Song', default: [] }])
  tracks: Song[];

  @Prop({
    type: schema.Types.Mixed,
    default: 'public',
    enum: ['public', 'private', 'unlisted'],
  })
  privacy: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.index({ name: 'text', description: 'text' });
