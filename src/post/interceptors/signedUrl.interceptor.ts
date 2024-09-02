import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UploadService } from 'src/files/upload.service';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
   constructor(private readonly uploadService: UploadService) { }

   async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
      return next.handle().pipe(
         map(async (data) => {
            if (data?.data && Array.isArray(data.data)) {
               const postsWithSignedUrls = await Promise.all(data.data.map(async post => {
                  const { imageKey, textFileKey } = post;
                  post.imageKey = await this.uploadService.getSignedUrl(imageKey);
                  post.textFileKey = await this.uploadService.getSignedUrl(textFileKey);
                  return post;
               }));
               return { ...data, data: postsWithSignedUrls };
            }
            return data;
         })
      );
   }
}
