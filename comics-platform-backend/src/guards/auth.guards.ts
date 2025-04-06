import { CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const tokenPayload = await this.jwtService.verifyAsync(token);
            //console.log(token)
            //console.log("Full Token Payload guard:", tokenPayload);
            request.user = {
                userId: tokenPayload.sub,
                username: tokenPayload.username
            }
            return true;
        }
        catch{
            throw new UnauthorizedException();
        }
    }
}