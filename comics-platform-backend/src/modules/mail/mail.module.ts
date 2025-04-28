import { Module } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';

@Module({
    imports: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
