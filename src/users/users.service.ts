import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FileUploadService } from '../common/services/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findAll(search?: string) {
    const where = search ? { 
      email: ILike(`%${search}%`)
    } : {};

    const users = await this.userRepository.find({ where });
    return users.map(user => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    delete user.password;
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
    delete updatedUser.password;
    return updatedUser;
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    const user = await this.findOne(userId);
    const oldAvatarUrl = user.avatarUrl;
    
    user.avatarUrl = avatarUrl;
    const updatedUser = await this.userRepository.save(user);
    
    if (oldAvatarUrl) {
      await this.fileUploadService.deleteFile(oldAvatarUrl);
    }
    
    delete updatedUser.password;
    return updatedUser;
  }

  async updatePrivacySettings(userId: number, privacySettings: any) {
    const user = await this.findOne(userId);
    user.privacySettings = {
      ...user.privacySettings,
      ...privacySettings,
    };
    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async updatePreferences(userId: number, preferences: any) {
    const user = await this.findOne(userId);
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
    const updatedUser = await this.userRepository.save(user);
    delete updatedUser.password;
    return updatedUser;
  }

  async getProfile(userId: number) {
    const user = await this.findOne(userId);
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      socialLinks: user.socialLinks,
      privacySettings: user.privacySettings,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
