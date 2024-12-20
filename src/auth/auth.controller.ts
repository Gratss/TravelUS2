import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService, // Добавлено для работы с UserService
  ) {}

  // Регистрация пользователя
  @Post('register')
  async register(
    @Body() body: { username: string; password: string; email: string },
  ) {
    const { username, password, email } = body;
    return await this.authService.register(username, password, email);
  }

  // Логин пользователя
  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    const { username, password } = credentials;

    // Используем AuthService для обработки логина
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.authService.generateJwt(payload),
    };
  }

  // Запрос на сброс пароля
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body.email);
  }

  // Сброс пароля
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(body.token, body.newPassword);
  }

  // Обновление токена
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  // Выход из системы
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return await this.authService.logout(body.refreshToken);
  }

  // Подтверждение email
  @Post('verify-email')
  async verifyEmail(@Body() body: { token: string }) {
    return await this.authService.verifyEmail(body.token);
  }

  // Повторная отправка письма для подтверждения email
  @Post('resend-verification')
  async resendVerificationEmail(@Body() body: { email: string }) {
    return await this.authService.resendVerificationEmail(body.email);
  }
}
