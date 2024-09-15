import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";

@Injectable()
export class TextValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value.text || value.text.trim() === "") {
      throw new BadRequestException("Text is required and cannot be empty.");
    }
    return value;
  }
}
