import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users: { [key: string]: string } = {}; // Хранение пользователей

  // При подключении нового пользователя
  handleConnection(client: Socket) {
    console.log('User connected:', client.id);
  }

  // При отключении пользователя
  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
    delete this.users[client.id];
    this.updateUsersList();
  }

  // Слушаем событие "setUsername" для задания имени пользователя
  @SubscribeMessage('setUsername')
  setUsername(client: Socket, username: string) {
    this.users[client.id] = username;
    this.updateUsersList();
  }

  // Слушаем событие "chatMessage" для отправки сообщений
  @SubscribeMessage('chatMessage')
  handleMessage(client: Socket, message: string) {
    const username = this.users[client.id] || 'Anonymous';
    this.server.emit('chatMessage', { user: username, message });
  }

  // Обновление списка пользователей
  private updateUsersList() {
    const userList = Object.values(this.users);
    this.server.emit('userList', userList);
  }

  @SubscribeMessage('message')
  async sendMessage(message: { text: string }) {
    return { success: true };
  }
}
