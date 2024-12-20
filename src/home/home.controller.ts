import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { FilterDestinationsDto } from './dto/filter-destinations.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHome() {
    return this.homeService.getHome();
  }

  @Get('featured')
  getFeatured() {
    return this.homeService.getFeaturedContent();
  }

  @Get('destinations')
  findAllDestinations(@Query() filterDto: FilterDestinationsDto): Promise<Destination[]> {
    return this.homeService.findAllDestinations(filterDto);
  }

  @Get('destinations/search')
  searchDestinations(@Query('query') query: string): Promise<Destination[]> {
    return this.homeService.searchDestinations(query);
  }

  @Get('destinations/:id')
  findOneDestination(@Param('id') id: string): Promise<Destination> {
    return this.homeService.findOneDestination(+id);
  }

  @Post('destinations')
  createDestination(@Body() createDestinationDto: CreateDestinationDto): Promise<Destination> {
    return this.homeService.createDestination(createDestinationDto);
  }

  @Put('destinations/:id')
  updateDestination(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    return this.homeService.updateDestination(+id, updateDestinationDto);
  }

  @Delete('destinations/:id')
  removeDestination(@Param('id') id: string): Promise<void> {
    return this.homeService.removeDestination(+id);
  }
}