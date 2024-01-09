import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as schema } from 'mongoose';
import { Song } from '../song/song.schema';

export type ArtistDocument = Artist & Document;

export interface IArtist {
  name: string;
  profile: string;
  backup_profile?: string;
  songs?: Types.ObjectId[];
  header: string;
  is_verified: boolean;
  streams: number;
  followers: number;
}

@Schema({ collection: 'artists' })
export class Artist {
  @Prop({ type: Number, required: true })
  streams: number;

  @Prop({ type: Number, required: true })
  followers: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  profile: string;

  @Prop({ type: String })
  backup_profile: string;

  @Prop({ type: Boolean })
  is_verified: boolean;

  @Prop({
    type: [{ type: schema.Types.ObjectId, ref: 'Song', default: [] }],
  })
  songs: Song[];

  @Prop({ type: String, required: true })
  header: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

ArtistSchema.index({ name: 'text' });
