import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  duration: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'json', nullable: true })
  itinerary: any;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
