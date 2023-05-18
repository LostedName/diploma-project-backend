import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthActor } from './auth.actor';
import { AuthenticationResponseDto } from './dtos/authentication-response-dto';
import { RegistrationDto } from './dtos/registration-dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';
import { SendChangePasswordLinkDto } from './dtos/send-change-password-link-dto';
import { TwoFactorAuthConfirmationDto } from './dtos/two-factor-auth-confirmation-dto';
import { TwoFactorAuthResponseDto } from './dtos/two-factor-auth-response-dto';
import { UserAuthenticationDto } from './dtos/user-authentication-dto';
import { ConfirmRegistrationResponseDto } from './dtos/confirm-registration-response-dto';
import { SendConfirmationCodeDto } from './dtos/send-confirmation-code-dto';
import { JwtAuthGuard } from 'apps/auth/src/common/guards/jwt-auth.guard';
import { AuthData } from 'apps/auth/src/common/decorators/auth-data.decorator';
import { AuthContent } from 'apps/shared/src/modules/auth/auth.service';

@ApiTags('Auth')
@Controller('/api/user/auth')
export class UserAuthController {
  constructor(private readonly actor: UserAuthActor) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'New user created' })
  @ApiResponse({ status: 400, description: 'User already exist' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('registration')
  registration(@Body() body: RegistrationDto): Promise<string> {
    return this.actor.registration(body);
  }

  @ApiOperation({ summary: 'Resend confirmation code' })
  @ApiResponse({ status: 200, description: 'Confirmation code successfully resended' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('resend/confirmation')
  resendConfirmationCode(@Body() body: SendConfirmationCodeDto): Promise<string> {
    return this.actor.resendConfirmationCode(body.email);
  }

  @ApiOperation({ summary: 'User confirmation' })
  @ApiResponse({ status: 201, description: 'User email confirmed' })
  @ApiResponse({ status: 400, description: 'Passwords do not match' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('confirm-registration')
  confirmRegistration(@AuthData() authData: AuthContent): Promise<ConfirmRegistrationResponseDto> {
    return this.actor.confirmRegistration(authData);
  }

  @ApiOperation({ summary: 'User authentication' })
  @ApiResponse({ status: 201, description: 'Authentificate user and returns user id', type: AuthenticationResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('authentication')
  authentication(@Body() body: UserAuthenticationDto): Promise<AuthenticationResponseDto> {
    return this.actor.authentication(body);
  }

  @ApiOperation({ summary: 'Confirm user auth code' })
  @ApiResponse({
    status: 201,
    description: 'User auth code confirmed',
    type: TwoFactorAuthResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Auth codes do not match' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2f-auth')
  twoFactorAuthConfirmation(
    @Body() body: TwoFactorAuthConfirmationDto,
    @AuthData() authData: AuthContent,
  ): Promise<TwoFactorAuthResponseDto> {
    return this.actor.twoFactorAuthConfirmation(body, authData);
  }

  @ApiOperation({ summary: 'Resend auth code' })
  @ApiResponse({ status: 200, description: 'Auth code successfully resended' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('resend/auth')
  resendAuthCode(@AuthData() authData: AuthContent): Promise<string> {
    return this.actor.resendAuthCode(authData.userId);
  }

  @ApiOperation({ summary: 'Send link to reset user password' })
  @ApiResponse({ status: 201, description: 'Link successfully sended' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('send/change-password-link')
  sendChangePasswordLink(@Body() body: SendChangePasswordLinkDto): Promise<string> {
    return this.actor.sendChangePasswordLink(body.email);
  }

  @ApiOperation({ summary: 'Resend link to reset user password' })
  @ApiResponse({ status: 200, description: 'Link successfully resended' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @Post('resend/change-password-link')
  resendChangePasswordLink(@Body() body: SendChangePasswordLinkDto): Promise<string> {
    return this.actor.sendChangePasswordLink(body.email);
  }

  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password successfully reseted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto, @AuthData() authData: AuthContent): Promise<string> {
    return this.actor.resetPassword(body, authData);
  }

  @ApiOperation({ summary: 'Verify password token' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 403, description: 'Token invalid or expired' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('verify-password-token')
  verifyPasswordToken(): string {
    return 'Ok!';
  }
}
