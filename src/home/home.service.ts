import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { FilterDestinationsDto } from './dto/filter-destinations.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
  ) {}

  getHome() {
    return {
      message: 'Welcome to the Travel US API',
    };
  }

  getFeaturedContent() {
    return {
      featured: [],
    };
  }

  async findAllDestinations(filterDto: FilterDestinationsDto): Promise<Destination[]> {
    const { search, attraction, isActive, sortBy, order } = filterDto;
    const where: FindOptionsWhere<Destination> = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const queryBuilder = this.destinationRepository.createQueryBuilder('destination');

    if (search) {
      queryBuilder.where(
        '(LOWER(destination.name) LIKE LOWER(:search) OR LOWER(destination.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (attraction) {
      queryBuilder.andWhere(':attraction = ANY(destination.attractions)', { attraction });
    }

    if (sortBy) {
      queryBuilder.orderBy(`destination.${sortBy}`, order || 'ASC');
    }

    return queryBuilder.getMany();
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    return this.destinationRepository.find({
      where: [
        { name: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) }
      ],
    });
  }

  async findOneDestination(id: number): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({ where: { id } });
    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return destination;
  }

  createDestination(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    const destination = this.destinationRepository.create(createDestinationDto);
    return this.destinationRepository.save(destination);
  }

  async updateDestination(
    id: number,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.findOneDestination(id);
    Object.assign(destination, updateDestinationDto);
    return this.destinationRepository.save(destination);
  }

  async removeDestination(id: number): Promise<void> {
    const result = await this.destinationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
  }
}
