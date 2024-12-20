import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
