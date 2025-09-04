import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser, UserPayload } from '../utils/user-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: RequestWithUser = ctx
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token);
      req.user = { userId: payload.userId, username: payload.username };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
