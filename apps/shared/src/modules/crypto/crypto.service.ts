import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '../logging/logger.service';
import * as crypto from 'lcryptowrap';
@Injectable()
export class CryptoService {
  readonly logger: LoggerService;

  constructor(private readonly configService: ConfigService, logger: AppLogger) {
    this.logger = logger.withContext('CryptoService');
  }

  async hash(data: string | Buffer): Promise<string> {
    let dataBuffer: Buffer = null;
    if (typeof data === 'string') {
      dataBuffer = Buffer.from(data);
    } else {
      dataBuffer = data;
    }
    const digest = crypto.CreateDigest('bash256', dataBuffer);
    const hash = digest.digest.toString('hex');
    return hash;
  }

  async compare(data: string | Buffer, hash: string): Promise<boolean> {
    const dataHash = await this.hash(data);
    return dataHash === hash;
  }
}
