import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ChatModule } from './chats/chat.module';
import { Conversation } from './chats/entities/conversation.entity';
import { Message } from './chats/entities/message.entity';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    // type: 'mysql',
    // database: 'railway',
    // host: 'containers-us-west-34.railway.app',
    // password: 'gymYYvC3clradEDCGuRe',
    // port: 5589,
    // username: 'root',
    // synchronize: true,
    // entities: [User, Conversation, Message],
    // }),
    ConfigModule.forRoot({}),
    // AuthModule,
    // ChatModule,
    // NotifyModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
