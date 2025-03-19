import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from 'src/services/users/users.service';


@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

      @Get('check-username-email')
      async checkUsernameOrEmail(@Query('value') value: string) {
        return this.usersService.checkUsernameOrEmail(value);
    }
}
