import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { AuthModule } from "../auth/auth.module";
import { RecaptchaModule } from "src/recapcha/recapcha.module";
import { UploadService } from "src/files/upload.service";
import { PostRepository } from "./posts.repository";
import { TypeOrmExModule } from "src/common/modules/typeorm.module";
import { RecaptchaService } from "src/recapcha/recapcha.service";
import { HttpModule } from "@nestjs/axios";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { SignedUrlInterceptor } from "./interceptors/signedUrl.interceptor";
import { PubSubModule } from "src/pub-sub/pub-sub.module";
import { BullModule } from "@nestjs/bull";
import { TextProcessor } from "src/post/processors/text.processor";
import { ImageProcessor } from "src/post/processors/image.processor";

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PostRepository]),
    RecaptchaModule,
    AuthModule,
    HttpModule,
    PubSubModule,
    BullModule.forRoot({
      url: "redis://localhost:6379",
    }),
    BullModule.registerQueue({
      name: "image-processing",
    }),
    BullModule.registerQueue({
      name: "text-processing",
    }),
  ],
  providers: [
    PostsService,
    PostsResolver,
    UploadService,
    RecaptchaService,
    ImageProcessor,
    TextProcessor,
    {
      provide: APP_INTERCEPTOR,
      useClass: SignedUrlInterceptor,
    },
  ],
})
export class PostsModule {}
