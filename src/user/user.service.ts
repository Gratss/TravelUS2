import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    const user = this.userRepository.create({
      username: name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
    });
    const savedUser = await this.userRepository.save(user);

    await this.sendVerificationEmail(email, verificationToken);
    return savedUser;
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) throw new NotFoundException('Invalid verification token');
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);
  }

  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const verificationLink = `${process.env.APP_URL}/users/verify-email/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isBlocked = true;
    return await this.userRepository.save(user);
  }

  // Обновление пароля
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  // Подтверждение email
  async verifyEmailById(userId: number): Promise<void> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    user.isEmailVerified = true;
    await this.userRepository.save(user);
  }

  // Обновление профиля пользователя
  async updateProfile(
    userId: number,
    updateData: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
    },
  ): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  // Обновление роли пользователя
  async updateRole(userId: number, role: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    return await this.userRepository.save(user);
  }

  // Поиск пользователей с фильтрацией
  async findUsers(filters: {
    role?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
    search?: string;
  }): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters.role) {
      query.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters.isEmailVerified !== undefined) {
      query.andWhere('user.isEmailVerified = :isEmailVerified', { 
        isEmailVerified: filters.isEmailVerified 
      });
    }

    if (filters.search) {
      query.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search OR user.firstName LIKE :search OR user.lastName LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return await query.getMany();
  }

  // Обновление времени последнего входа
  async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  // Блокировка/разблокировка пользователя
  async toggleUserActive(userId: number, isActive: boolean): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    return await this.userRepository.save(user);
  }
}
