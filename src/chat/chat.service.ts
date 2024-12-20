import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async createChat(name: string): Promise<Chat> {
        const chat = this.chatRepository.create({ name });
        return this.chatRepository.save(chat);
    }

    async sendMessage(chatId: number, text: string): Promise<Message> {
        const message = this.messageRepository.create({ chat: { id: chatId }, text, timestamp: new Date() });
        return this.messageRepository.save(message);
    }

    async getMessages(chatId: number): Promise<Message[]> {
        return this.messageRepository.find({ where: { chat: { id: chatId } }, order: { timestamp: 'ASC' } });
    }
}
