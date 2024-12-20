import { Controller, Get, Query } from '@nestjs/common';
import { TripService } from './trip.service';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  async filterTrips(
    @Query('destination') destination: string,
    @Query('date') date: string,
    @Query('vehicle') vehicle: string,
  ) {
    return this.tripService.filterTrips(destination, date, vehicle);
  }
}