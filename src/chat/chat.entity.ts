import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './entities/message.entity';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];
}
