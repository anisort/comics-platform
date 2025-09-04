import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { UserPayload } from '../../utils/user-payload';

type AuthInput = { username: string; password: string };
type SignInData = { userId: number; username: string };
type AuthResult = { accessToken: string; userId: number; username: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async register(newUser: RegisterUserDto): Promise<RegisterUserDto> {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const user = this.usersRepository.create(newUser);
    await this.usersRepository.save(user);
    const token = this.generateToken(user.id, user.username);
    void this.mailService.sendActivationEmail(newUser.email, token);
    return user;
  }

  async activateAccount(
    token: string,
  ): Promise<{ email: string; username: string } | { errorMessage: string }> {
    try {
      const decoded = this.jwtService.verify<UserPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET')!,
      });
      const user = await this.usersRepository.findOne({
        where: { id: decoded.userId },
      });
      if (!user) {
        return { errorMessage: 'User not found' };
      }
      user.isActive = true;
      await this.usersRepository.save(user);
      return {
        email: user.email,
        username: user.username,
      };
    } catch {
      return { errorMessage: 'Invalid or expired token' };
    }
  }

  async authenticate(authInput: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(authInput);
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = this.generateToken(user.userId, user.username);
    return { accessToken, username: user.username, userId: user.userId };
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByName(input.username);

    if (
      user &&
      (await bcrypt.compare(input.password, user.password)) &&
      user.isActive
    ) {
      return {
        userId: user.id,
        username: user.username,
      };
    }

    return null;
  }

  private generateToken(userId: number, username: string): string {
    return this.jwtService.sign(
      { userId, username },
      {
        secret: this.configService.get<string>('JWT_SECRET')!,
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      },
    );
  }
}
