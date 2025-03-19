import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() newUser: RegisterUserDto,
  ) {
    return this.authService.register(newUser);
  }

  @Get('activate')
  async activate(@Query('token') token: string) {
    return this.authService.activateAccount(token);
  }

  // @Get('check-username-email')
  // async checkUsernameOrEmail(@Query('value') value: string) {
  //   return this.authService.checkUsernameOrEmail(value);
  // }

}
