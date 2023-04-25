import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinksService {
  constructor(private readonly configService: ConfigService) {}

  getEmailVerificationLink(token: string): string {
    return `${this.configService.get(
      'BACKEND_URL',
    )}/api/user/auth/verify-email?token=${token}`;
  }
}
