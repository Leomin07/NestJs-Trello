import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from './chat.service';
import { ConversationDto } from './dto/conversation.dto';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { LeaveConversationDto } from './dto/leaveConversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  namespace: 'message',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  // afterInit() {
  //   this.server.use(async (client, next) => {
  //     try {
  //       const decoded = await this.authService.verifyToken(
  //         client.handshake.headers.authorization,
  //       );
  //       if (!decoded) throw new UnauthorizedException('token invalid');
  //       Object.assign(client.data, { username: decoded.username });
  //       return next();
  //     } catch (error) {
  //       this.server.disconnectSockets();
  //       throw new Error(error.message);
  //     }
  //   });
  // }

  handleConnection() {
    this.server.use(async (client, next) => {
      try {
        const decoded = await this.authService.verifyToken(
          client.handshake.headers.authorization,
        );
        if (!decoded) throw new UnauthorizedException('token invalid');
        Object.assign(client.data, { username: decoded.username });
        return next();
      } catch (error) {
        this.server.disconnectSockets();
        throw new Error(error.message);
      }
    });
  }

  @SubscribeMessage('createRoom')
  async handleCreateConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: ConversationDto,
  ) {
    const room = await this.chatService.createConversation(body);
    client.emit('createdRoom', { room });
  }

  @SubscribeMessage('new-message-to-server')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ): Promise<void> {
    const message = await this.chatService.createMessage(data);
    this.server
      .to(message.conversation.title)
      .emit('new-message-to-client', message);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinConversationDto,
  ) {
    const room = await this.chatService.addMember(body);
    client.join(room.title);
    client.to(room.title).emit('joinedRoom', { room });
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveConversationDto,
  ) {
    const room = await this.chatService.leaveConversation(data);
    client.leave(room.title);
    client.emit('leftRoom', room);
  }
}
