import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class RecaptchaService {
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>("RECAPTCHA_SECRET_KEY");
  }

  async validateRecaptcha(recaptchaToken: string): Promise<boolean> {
    const response = await lastValueFrom(
      this.httpService.post(
        "https://www.google.com/recaptcha/api/siteverify",
        {},
        {
          params: {
            secret: this.secretKey,
            response: recaptchaToken,
          },
        },
      ),
    );

    const data = response.data;
    return data.success;
  }
}
