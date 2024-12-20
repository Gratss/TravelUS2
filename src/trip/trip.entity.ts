import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Trip {
@PrimaryGeneratedColumn()
id: number;

@Column()
destination: string;

@Column()
date: string;

@Column()
vehicle: string;

@Column()
description: string;

@ManyToOne(() => User, user => user.id)
user: User;
}
