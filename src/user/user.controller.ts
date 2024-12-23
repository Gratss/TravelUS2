import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  async createUser(@Body() userData: { name: string; email: string; password: string; phone: string }) {
    const { name, email, password, phone } = userData;
    return await this.userService.createUser(name, email, password, phone);
  }


  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  // получение 1ого юзара по айди
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  // обнова данных
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<{ name: string; email: string; password: string }>,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateData);
  }

  // удалить юзера
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }

  // find po emailu
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findByEmail(email);
  }

  // блокнуть
  @Put(':id/block')
  async blockUser(@Param('id') id: number): Promise<User> {
    return await this.userService.blockUser(id);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.userService.verifyEmail(token);
    return { message: 'Email successfully verified!' };
  }
}