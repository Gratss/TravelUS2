import { IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsEnum(ProfileVisibility)
  profileVisibility?: ProfileVisibility;

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showSocialLinks?: boolean;
}
