import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailsService } from './emails.service';

@Processor('emails-queue')
export class EmailsProcessor extends WorkerHost {
  constructor(private readonly emailsService: EmailsService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'welcome-email') {
      const { to, name } = job.data;
      await this.emailsService.sendWelcomeEmail(to, name);
    }
  }
}
