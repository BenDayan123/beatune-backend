import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as schema } from 'mongoose';
import { Playlist } from '@database/playlist/playlist.schema';

export type UserDocument = User & Document;

export interface IUser {
  username: string;
  profile: string;
  email: string;
  password: string;
  playlists: Types.ObjectId[];
}

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  profile: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop([{ type: schema.Types.ObjectId, ref: 'Playlist', default: [] }])
  playlists: Playlist[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ name: 'text', email: 'text' });
