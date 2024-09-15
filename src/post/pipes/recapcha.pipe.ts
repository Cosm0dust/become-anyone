import { ArgumentMetadata, Injectable, PipeTransform, UnauthorizedException } from "@nestjs/common";
import { RecaptchaService } from "src/recapcha/recapcha.service";

@Injectable()
export class RecaptchaValidationPipe implements PipeTransform {
  constructor(private readonly recaptchaService: RecaptchaService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.data === "input") {
      const isRecaptchaValid = await this.recaptchaService.validateRecaptcha(value.recaptchaToken);

      if (!isRecaptchaValid) {
        throw new UnauthorizedException("Invalid reCAPTCHA");
      }
    }

    return value;
  }
}
