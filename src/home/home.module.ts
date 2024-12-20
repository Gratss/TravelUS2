import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Destination } from './entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destination])
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}