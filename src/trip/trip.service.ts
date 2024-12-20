import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
) {}

async filterTrips(destination: string, date: string, vehicle: string): Promise<Trip[]> {
    const query = this.tripRepository.createQueryBuilder('trip');

    if (destination) {
    query.andWhere('trip.destination = :destination', { destination });
    }

    if (date) {
    query.andWhere('trip.date = :date', { date });
    }

    if (vehicle) {
    query.andWhere('trip.vehicle = :vehicle', { vehicle });
    }

    return await query.getMany();
}
async findCarpoolers(tripId: number): Promise<Trip[]> {
    return await this.tripRepository.find({
    where: { id: tripId },
    relations: ['user'],
    });
}  

async searchCarpools(destination: string, date: string) {
    return this.tripRepository.find({
    where: { destination, date },
    relations: ['user'],
    });
}

async getCarpoolDetails(id: number) {
    return this.tripRepository.findOne({
    where: { id },
    relations: ['user'],
    });
}
}
