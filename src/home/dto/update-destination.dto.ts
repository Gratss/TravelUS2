import { IsString, IsNotEmpty, IsObject, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}
