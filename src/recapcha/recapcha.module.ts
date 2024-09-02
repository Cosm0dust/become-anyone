import { Module, } from '@nestjs/common';
import { RecaptchaService } from './recapcha.service';
import { HttpModule } from '@nestjs/axios';


@Module({
   imports: [HttpModule],
   providers: [RecaptchaService],
   exports: [RecaptchaService],
})
export class RecaptchaModule { }