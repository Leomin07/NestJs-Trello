import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as OneSignal from 'onesignal-node';
import { notifyQueue } from '../helpers/queue';

const client = new OneSignal.Client(process.env.APP_ID, process.env.API_KEY);

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  async pushNotify(content) {
    // const response = await client.createNotification(content);
    // return response.body;
  }

  @Cron('*/10 * * * * *')
  async handlePushNotify(content) {
    const body = await this.pushNotify(content);
    notifyQueue.add('push-notify', { content });
  }
}
