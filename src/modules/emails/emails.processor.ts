import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailsService } from './emails.service';
import { ConflictException } from '@nestjs/common';

@Processor('emails-queue', {
  concurrency: 5,
})
export class EmailsProcessor extends WorkerHost {
  constructor(private readonly emailsService: EmailsService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'welcome-email') {
      const { to, name } = job.data;
      await this.emailsService.sendWelcomeEmail(to, name);
    } else {
      throw new ConflictException('Error in sending e-mail.');
    }
  }
}
