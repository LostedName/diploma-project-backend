import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OAuthActor } from './oauth.actor';
import { OAuthScreenParamsDto, OAuthScreenResponse } from './dto/oauth-consent-screen.dto';
import { OAuthConfirmConsentDto, OAuthConfirmConsentResponse } from './dto/oauth-confirm-consent.dto';
import { OAuthCodeExchangeDto, OAuthCodeExchangeResponse } from './dto/oauth-code-exchange.dto';

@ApiTags('OAuth authentication')
@Controller('api/v1/oauth')
export class OAuthController {
  constructor(private readonly actor: OAuthActor) {}

  @ApiOperation({ summary: 'Validates data provided in oauth login link and gives info for OAuth 2.0 consent screen' })
  @ApiQuery({
    name: 'client_id',
    description: 'Client id provided in query params',
    required: true,
  })
  @ApiQuery({
    name: 'redirect_uri',
    description: 'Redirect uri provided in query params',
    required: true,
  })
  @ApiQuery({
    name: 'scopes',
    description: 'Scopes provided in query params',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Give u oauth 2.0 consent screen info',
    type: OAuthScreenResponse,
  })
  @Get('/consent-screen')
  async getOauthConsentScreen(@Query() params: OAuthScreenParamsDto): Promise<OAuthScreenResponse> {
    return this.actor.getOauthConsentScreen(params);
  }

  @ApiOperation({ summary: 'Validates data provided in oauth login link' })
  @ApiBody({ type: OAuthConfirmConsentDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'Returns an authorization code grant',
    type: OAuthConfirmConsentResponse,
  })
  @Post('/consent-confirm')
  async confirmConsentScreen(@Body() body: OAuthConfirmConsentDto): Promise<OAuthConfirmConsentResponse> {
    return this.actor.confirmConsentScreen(body);
  }

  @ApiOperation({ summary: 'Exchange authorization code with access token' })
  @ApiBody({ type: OAuthCodeExchangeDto, required: true })
  @Post('/token')
  async exchangeCodeToToken(@Body() body: OAuthCodeExchangeDto): Promise<OAuthCodeExchangeResponse> {
    return this.actor.exchangeCodeToToken(body);
  }
}
