import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Регистрируем User в TypeORM
  providers: [UserService], // Регистрируем UserService
  exports: [UserService], // Экспортируем UserService
})
export class UserModule {}
