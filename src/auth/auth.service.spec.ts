import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // Генерация токена
  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    const payload = { username: user.username, sub: user.id };  // sub индификатор
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  // Регистрация пользователя
  async register(username: string, password: string, email: string, phone: string): Promise<User> {
    return await this.userService.createUser(username, email, password, phone);
  }
}
