import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TripModule } from './trip/trip.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { RoutesModule } from './routes/routes.module';
import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1111',
      database: 'travelus',
      autoLoadEntities: true,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    AuthModule,
    TripModule,
    ChatModule,
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
    RoutesModule,
    HomeModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
