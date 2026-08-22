import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailsService } from './emails.service';
import { EmailsProcessor } from './emails.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails-queue',
    }),
  ],
  providers: [EmailsService, EmailsProcessor],
  exports: [BullModule],
})
export class EmailsModule {}
