import { IsString, IsNotEmpty, IsObject, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsObject()
  @IsOptional()
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsArray()
  @IsOptional()
  attractions?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
