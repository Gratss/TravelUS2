import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from '../chat.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat: Chat;

    @Column()
    timestamp: Date;
}
