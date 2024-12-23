import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean; // Поле для проверки email

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  emailVerificationToken: string; // Токен для подтверждения email

  @Column({ nullable: true })
  phone: string; // Добавляем поле для номера телефона

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @Column({ default: false })
  isBlocked: boolean; // Поле для блокировки пользователя
}
