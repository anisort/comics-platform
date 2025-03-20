import { Controller, Post, Body, Get, Query, HttpStatus, HttpCode, NotImplementedException, UseGuards, Request } from '@nestjs/common';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from 'src/guards/auth.guards';

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

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: {username: string; password: string}){
    return this.authService.authenticate(input);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUserInfo(@Request() request) {
    return request.user;
  }

}
