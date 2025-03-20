import { Controller, Post, Get, HttpCode, HttpStatus, NotImplementedException, UseGuards, Request } from '@nestjs/common';
import { PassportJwtAuthGuard } from 'src/guards/passport-jwt.guard';
import { PassportLocalGuard } from 'src/guards/passport-local.guard';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth-v2')
export class PassportAuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Request() request){
        return this.authService.signIn(request.user);
    }

    @Get('me')
    @UseGuards(PassportJwtAuthGuard)
    getUserInfo(@Request() request) {
        return request.user;
    }

}
