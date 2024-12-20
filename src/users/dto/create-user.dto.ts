import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };

  @IsOptional()
  privacySettings?: {
    profileVisibility?: 'public' | 'private' | 'friends';
    showEmail?: boolean;
    showSocialLinks?: boolean;
  };

  @IsOptional()
  preferences?: {
    emailNotifications?: boolean;
    language?: string;
    theme?: 'light' | 'dark';
  };
}
