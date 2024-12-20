import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { FileUploadService } from '../common/services/file-upload.service';
import { UpdatePrivacySettingsDto } from './dto/update-privacy-settings.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  findAll(@Query('search') search?: string) {
    return this.usersService.findAll(search);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const avatarUrl = await this.fileUploadService.uploadAvatar(file);
    return this.usersService.updateAvatar(req.user.id, avatarUrl);
  }

  @Patch('privacy-settings')
  updatePrivacySettings(
    @Request() req,
    @Body() privacySettings: UpdatePrivacySettingsDto
  ) {
    return this.usersService.updatePrivacySettings(req.user.id, privacySettings);
  }

  @Patch('preferences')
  updatePreferences(
    @Request() req,
    @Body() preferences: UpdatePreferencesDto
  ) {
    return this.usersService.updatePreferences(req.user.id, preferences);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }
}
