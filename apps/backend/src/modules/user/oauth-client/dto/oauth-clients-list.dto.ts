import { OauthClientEntity } from './../../../../../../shared/src/modules/database/entities/oauth-client.entity';

export class OauthClientsListDto {}

export class OauthClientsListResponseDto {
  items: OauthClientEntity[];
  total: number;
}
