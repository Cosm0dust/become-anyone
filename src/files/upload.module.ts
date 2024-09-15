import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { UploadService } from "./upload.service";
import { BullModule } from "@nestjs/bull";
import { TextProcessor } from "src/post/processors/text.processor";
import { ImageProcessor } from "src/post/processors/image.processor";

@Module({
  imports: [ConfigModule, HttpModule.register({})],
  providers: [UploadService],
})
export class UploadModule {}
