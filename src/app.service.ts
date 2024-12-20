import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { TripService } from './trip/trip.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tripService: TripService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid username or password');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }

  async register(
    username: string,
    password: string,
    email: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser(username, email, hashedPassword);
  }

  async filterTrips(destination?: string, date?: string, vehicle?: string) {
    return this.tripService.filterTrips(destination, date, vehicle);
  }

  async findCarpoolers(tripId: number) {
    return this.tripService.findCarpoolers(tripId);
  }

  async getTripDetails(tripId: number) {
    return this.tripService.getCarpoolDetails(tripId);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
