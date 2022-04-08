import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message]), AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
