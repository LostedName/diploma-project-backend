import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OAuthLoginDto, OAuthLoginResultDto } from './dto/oauth-dto';
import { OAuthActor } from './oauth.actor';

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
  async loginOAuth(
    @Body() loginData: OAuthLoginDto,
  ): Promise<OAuthLoginResultDto> {
    return this.actor.loginOAuth(loginData);
  }
}
