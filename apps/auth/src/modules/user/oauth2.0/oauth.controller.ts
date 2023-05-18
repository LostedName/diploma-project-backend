import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OAuthLoginDto, OAuthLoginResultDto } from './dto/oauth-dto';
import { OAuthActor } from './oauth.actor';
import { OAuthScreenParamsDto, OAuthScreenResponse } from './dto/oauth-screen.dto';

@ApiTags('OAuth authentication')
@Controller('api/v1/oauth')
export class OAuthController {
  constructor(private readonly actor: OAuthActor) {}

  @ApiOperation({ summary: 'Logs in user using email and password' })
  @ApiBody({ type: OAuthLoginDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'Give u oauth 2.0 token for tests',
    type: OAuthLoginResultDto,
  })
  @Post('login-aouth/test')
  async loginOAuth(@Body() loginData: OAuthLoginDto): Promise<OAuthLoginResultDto> {
    return this.actor.loginOAuth(loginData);
  }

  @ApiOperation({ summary: 'Validates data provided in oauth login link' })
  @ApiQuery({
    name: 'client_id',
    description: 'Client id provided in query params',
    required: true,
  })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Client id provided in query params',
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
  async validateOAuthData(@Query() params: OAuthScreenParamsDto): Promise<OAuthScreenResponse> {
    return this.actor.getOAuthScreen(params);
  }
}
