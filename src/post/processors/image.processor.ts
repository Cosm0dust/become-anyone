import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import sharp from "sharp";
import { UploadService } from "../../files/upload.service";
import { SerializedFileBuffer } from "../interfaces/interfaces";

@Processor("image-processing")
export class ImageProcessor {
  constructor(private readonly fileUploadService: UploadService) {}

  @Process("process-image")
  async handleImageProcessing(job: Job): Promise<string> {
    const { file } = job.data;

    const processedFileKey = await this.processImageFile(file);
    return processedFileKey;
  }

  private async processImageFile(file: SerializedFileBuffer): Promise<string> {
    const { buffer, filename } = file;
    const realBuffer = Buffer.from(buffer.data);
    const { width, height } = await sharp(realBuffer).metadata();

    let sharpedBuffer;
    if (width > 320 || height > 240) {
      sharpedBuffer = await sharp(realBuffer).resize(320, 240, { fit: "inside" }).toBuffer();
    }

    const s3Response = await this.fileUploadService.uploadToS3(sharpedBuffer, filename);

    return s3Response.Key;
  }
}
