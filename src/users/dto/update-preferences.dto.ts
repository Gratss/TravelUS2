import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;
}
