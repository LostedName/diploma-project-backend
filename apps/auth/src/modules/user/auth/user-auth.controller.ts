import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthActor } from './user-auth.actor';
import {
  UserAccountRegistrationDto,
  UserLoginDto,
  UserLoginResultDto,
} from './dto/user-auth-dto';

@ApiTags('User authentication')
@Controller('api/user/auth')
export class UserAuthController {
  constructor(private readonly actor: UserAuthActor) {}

  @ApiOperation({
    summary: 'Registers user account using email and password',
  })
  @ApiBody({ type: UserAccountRegistrationDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'Login result if login is successful',
    type: UserLoginResultDto,
  })
  @Post('register')
  async register(
    @Body() registerData: UserAccountRegistrationDto,
  ): Promise<UserLoginResultDto> {
    return this.actor.register(registerData);
  }

  @ApiOperation({ summary: 'Logs in user using email and password' })
  @ApiBody({ type: UserLoginDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'Login result if login is successful',
    type: UserLoginResultDto,
  })
  @Post('login')
  async login(@Body() loginData: UserLoginDto): Promise<UserLoginResultDto> {
    return this.actor.login(loginData);
  }
}
