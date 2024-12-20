import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'json', nullable: true })
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };

  @Column({ type: 'json', default: {
    profileVisibility: 'public',
    showEmail: false,
    showSocialLinks: false
  }})
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showSocialLinks: boolean;
  };

  @Column({ type: 'json', nullable: true })
  preferences: {
    emailNotifications?: boolean;
    language?: string;
    theme?: 'light' | 'dark';
  };
}
