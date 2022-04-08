import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/authorization.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/conversation-by-user')
  listConversationByUser(@Req() req) {
    return this.chatService.listConversationByUser(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/message-by-conversation/:id')
  messageByConversation(@Param() id: number) {
    return this.chatService.messageByConversation(id);
  }
}
