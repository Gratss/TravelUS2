import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService, 
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET')); // для отладки
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.sub); 
  }
}
