import { Body, Controller, Post } from '@nestjs/common';
import { NotifyService } from './notify.service';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post('push-notify')
  async pushNotify(@Body() content: string) {
    return this.notifyService.handlePushNotify(content);
  }
}
