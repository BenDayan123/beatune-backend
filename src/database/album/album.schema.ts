import { Song } from '@database/song/song.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as schema } from 'mongoose';

export type AlbumDocument = Album & Document;

export interface IAlbum {
  name: string;
  url: string;
  image: string;
  small_image: string;
  tiny_image: string;
  release_date: Date;
  total_tracks: number;
  artist_id: string;
  tracks?: Types.ObjectId[];
}

@Schema({ collection: 'albums', toJSON: { virtuals: true } })
export class Album {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, required: true })
  small_image: string;

  @Prop({ type: String, required: true })
  tiny_image: string;

  @Prop({ type: Date, required: true })
  release_date: Date;

  @Prop({ type: schema.Types.ObjectId, ref: 'Artist', required: true })
  artist_id: string;

  @Prop({ type: Number, required: true })
  total_tracks: Number;

  @Prop({
    type: [{ type: schema.Types.ObjectId, ref: 'Song', default: [] }],
  })
  tracks: Song[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

AlbumSchema.virtual('artist', {
  ref: 'Artist',
  localField: 'artist_id',
  foreignField: '_id',
  justOne: true,
});
