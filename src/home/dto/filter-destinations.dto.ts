import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDestinationsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  attraction?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'createdAt';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
