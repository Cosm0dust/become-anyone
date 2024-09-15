import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { UploadService } from "../../files/upload.service";
import { FileUpload } from "graphql-upload-ts";
import { BadRequestException } from "@nestjs/common";
import { SerializedFileBuffer } from "../interfaces/interfaces";

@Processor("text-processing")
export class TextProcessor {
  private readonly MAX_TEXT_FILE_SIZE = 100 * 1024;
  constructor(private readonly fileUploadService: UploadService) {}

  @Process("process-text")
  async handleTextProcessing(job: Job): Promise<string> {
    const { file } = job.data;
    const processedFileKey = await this.processTextFile(file);
    return processedFileKey;
  }

  private async processTextFile(file: SerializedFileBuffer): Promise<string> {
    const { buffer, filename } = file;
    const realBuffer = Buffer.from(buffer.data);
    if (realBuffer.length > this.MAX_TEXT_FILE_SIZE) {
      throw new BadRequestException("Text file size exceeds 100 KB");
    }
    const s3Response = await this.fileUploadService.uploadToS3(realBuffer, filename);
    return s3Response.Key;
  }
}
