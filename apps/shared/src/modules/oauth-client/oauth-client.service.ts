import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, LoggerService } from '@nestjs/common';
import { AppLogger } from '../logging/logger.service';
import { OauthClientEntity } from '../database/entities/oauth-client.entity';

@Injectable()
export class OauthClientService {
  readonly logger: LoggerService;

  constructor(
    @InjectRepository(OauthClientEntity)
    private readonly oauthClientRepository: Repository<OauthClientEntity>,
    logger: AppLogger,
  ) {
    this.logger = logger.withContext('OauthAppService');
  }
}
