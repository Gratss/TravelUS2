import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async createChat(@Body('name') name: string): Promise<any> {
        return this.chatService.createChat(name);
    }

    @Post(':chatId/messages')
    async sendMessage(@Param('chatId') chatId: number, @Body('text') text: string): Promise<Message> {
        return this.chatService.sendMessage(chatId, text);
    }

    @Get(':chatId/messages')
    async getMessages(@Param('chatId') chatId: number): Promise<Message[]> {
        return this.chatService.getMessages(chatId);
    }
}
