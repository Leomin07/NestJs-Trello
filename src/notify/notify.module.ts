import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notify',
    }),
  ],
  controllers: [NotifyController],
  providers: [NotifyService, SchedulerRegistry],
})
export class NotifyModule {}
