import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @Column({ type: 'text', array: true, default: '{}' })
  attractions: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
