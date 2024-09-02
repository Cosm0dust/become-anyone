import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload-ts';
import * as AWS from 'aws-sdk';
import sharp from 'sharp';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

@Injectable()
export class UploadService {
   private readonly FOLDER_NAME = 'become_anyone';
   private readonly MAX_TEXT_FILE_SIZE = 100 * 1024;
   private s3: AWS.S3;
   private s3Client: S3Client;
   private readonly bucketName: string;

   constructor(private readonly configService: ConfigService) {
      const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
      const region = this.configService.get<string>('AWS_REGION');

      this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

      AWS.config.update({
         accessKeyId,
         secretAccessKey,
         region,
      });

      this.s3 = new AWS.S3();
      this.s3Client = new S3Client({
         region,
         credentials: {
            accessKeyId,
            secretAccessKey,
         },
      });
   }

   async processFiles(files: FileUpload[]): Promise<{ imageKey?: string; textFileKey?: string }> {
      const { imageFile, textFile } = await this.validateAndClassifyFiles(files);

      const result: { imageKey?: string; textFileKey?: string } = {};

      if (imageFile) {
         result.imageKey = await this.processImageFile(imageFile);
      }

      if (textFile) {
         result.textFileKey = await this.processTextFile(textFile);
      }

      return result;
   }

   private async validateAndClassifyFiles(files: FileUpload[]): Promise<{ imageFile?: FileUpload; textFile?: FileUpload }> {
      let imageFile: FileUpload | undefined;
      let textFile: FileUpload | undefined;

      for (const file of files) {
         const { mimetype } = await file;
         if (['image/jpeg', 'image/png', 'image/gif'].includes(mimetype)) {
            if (imageFile) {
               throw new BadRequestException('You can only upload one image file.');
            }
            imageFile = await file;
         } else if (mimetype === 'text/plain') {
            if (textFile) {
               throw new BadRequestException('You can only upload one text file.');
            }
            textFile = await file;
         } else {
            throw new BadRequestException('Invalid file type. Only JPG, GIF, PNG, and TXT files are allowed.');
         }
      }

      return { imageFile, textFile };
   }

   private async processImageFile(file: FileUpload): Promise<string> {
      const { createReadStream, filename } = await file;
      let buffer = await this.streamToBuffer(createReadStream());

      const { width, height } = await sharp(buffer).metadata();

      if (width > 320 || height > 240) {
         buffer = await sharp(buffer)
            .resize(320, 240, { fit: 'inside' })
            .toBuffer();
      }

      const s3Response = await this.uploadToS3(buffer, filename);

      return s3Response.Key;
   }

   private async processTextFile(file: FileUpload): Promise<string> {
      const { createReadStream, filename } = await file;
      let buffer = await this.streamToBuffer(createReadStream());

      if (buffer.length > this.MAX_TEXT_FILE_SIZE) {
         throw new BadRequestException('Text file size exceeds 100 KB');
      }

      const s3Response = await this.uploadToS3(buffer, filename);

      return s3Response.Key;
   }

   private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
      return new Promise((resolve, reject) => {
         const chunks: Buffer[] = [];
         stream.on('data', (chunk) => chunks.push(chunk));
         stream.on('end', () => resolve(Buffer.concat(chunks)));
         stream.on('error', reject);
      });
   }

   private async uploadToS3(buffer: Buffer, filename: string): Promise<AWS.S3.ManagedUpload.SendData> {
      const uploadParams = {
         Bucket: this.bucketName, // Use bucketName from constructor
         Key: `${this.FOLDER_NAME}/${filename}`,
         Body: buffer,
         ContentType: 'application/octet-stream',
      };
      return this.s3.upload(uploadParams).promise();
   }

   async getSignedUrl(key: string): Promise<string> {
      const command = new GetObjectCommand({
         Bucket: this.bucketName, // Use bucketName from constructor
         Key: key,
      });
      return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
   }
}


