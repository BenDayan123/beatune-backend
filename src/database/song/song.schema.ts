import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types, Schema as schema } from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const Long = mongoose.Schema.Types.Long;

export type SongDocument = Song & Document;

export interface ISong {
  duration: number;
  artist_id: string;
  title: string;
  album_id: string;
  lyrics?: string;
}

@Schema({ collection: 'tracks', toJSON: { virtuals: true } })
export class Song {
  @Prop({ type: Number })
  duration: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  lyrics: string;

  @Prop({ type: schema.Types.ObjectId, ref: 'Album', required: true })
  album_id: string;

  @Prop({ type: schema.Types.ObjectId, ref: 'Artist' })
  artist_id: string;

  // @Prop({ type: Long, required: true })
  // view_count: number;

  // @Prop({ type: Number, required: true })
  // like_count: number;

  // @Prop({ type: String, required: true })
  // url: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);

SongSchema.virtual('album', {
  ref: 'Album',
  localField: 'album_id',
  foreignField: '_id',
  justOne: true,
});

SongSchema.virtual('artist', {
  ref: 'Artist',
  localField: 'artist_id',
  foreignField: '_id',
  justOne: true,
});
