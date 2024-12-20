import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    chatId: number;

    @IsString()
    text: string;
}
