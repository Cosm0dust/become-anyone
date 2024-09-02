import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';


@Module({
  imports: [ConfigModule, HttpModule.register({})],
  providers: [UploadService, UploadResolver],
})
export class UploadModule { }
