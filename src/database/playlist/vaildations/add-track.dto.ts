import { IsNumber, IsArray, IsOptional, IsString } from 'class-validator';

export class AddTrackModel {
  @IsOptional()
  @IsNumber()
  position?: number;
}

export class TracksUrlsModel {
  @IsArray()
  tracks: number[];
}
