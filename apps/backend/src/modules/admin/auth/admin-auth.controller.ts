import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthActor } from './admin-auth.actor';
import { AdminLoginDto, AdminLoginResultDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Authentication')
@Controller('api/admin/auth')
export class AdminAuthController {
  constructor(private readonly actor: AdminAuthActor) {}

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminLoginResultDto> {
    return this.actor.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: AdminRegisterDto,
  ): Promise<AdminLoginResultDto> {
    return this.actor.register(registerDto);
  }
}
