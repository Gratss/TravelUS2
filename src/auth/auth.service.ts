import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private refreshTokens: Map<string, { userId: number; token: string }> = new Map();
  private passwordResetTokens: Map<string, { userId: number; expires: Date }> = new Map();
  private emailVerificationTokens: Map<string, { userId: number; expires: Date }> = new Map();

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Логика логина
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  // Генерация JWT
  generateJwt(payload: any) {
    return this.jwtService.sign(payload);
  }

  // Регистрация
  async register(username: string, password: string, email: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(username, email, hashedPassword);
  }

  // Генерация refresh token
  generateRefreshToken(userId: number): string {
    const token = uuidv4();
    this.refreshTokens.set(token, { userId, token });
    return token;
  }

  // Обновление access token с помощью refresh token
  async refreshToken(refreshToken: string) {
    const tokenData = this.refreshTokens.get(refreshToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(tokenData.userId);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.generateJwt(payload),
      refresh_token: this.generateRefreshToken(user.id),
    };
  }

  // Выход из системы
  async logout(refreshToken: string) {
    this.refreshTokens.delete(refreshToken);
    return { message: 'Logged out successfully' };
  }

  // Запрос на сброс пароля
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    this.passwordResetTokens.set(token, {
      userId: user.id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // TODO: Отправка email с токеном для сброса пароля
    return { message: 'Password reset instructions sent to email' };
  }

  // Сброс пароля
  async resetPassword(token: string, newPassword: string) {
    const tokenData = this.passwordResetTokens.get(token);
    if (!tokenData || tokenData.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(tokenData.userId, hashedPassword);
    this.passwordResetTokens.delete(token);

    return { message: 'Password reset successfully' };
  }

  // Подтверждение email
  async verifyEmail(token: string) {
    const tokenData = this.emailVerificationTokens.get(token);
    if (!tokenData || tokenData.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.usersService.verifyEmailById(tokenData.userId);
    this.emailVerificationTokens.delete(token);

    return { message: 'Email verified successfully' };
  }

  // Повторная отправка письма для подтверждения email
  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    this.emailVerificationTokens.set(token, {
      userId: user.id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // TODO: Отправка email с токеном для подтверждения
    return { message: 'Verification email sent' };
  }
}
