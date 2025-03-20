import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';
import { RegisterUserDto } from '../../dto/register.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

type AuthInput = { username: string; password: string};
type SignInData = { userId: number; username: string};
type AuthResult = { accessToken: string; userId: number; username: string }

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {
    this.startAccountCleanupJob();
  }

  async register(newUser: RegisterUserDto): Promise<RegisterUserDto> {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const user = this.usersRepository.create(newUser);
    await this.usersRepository.save(user);

    const token = this.jwtService.sign(
      {userId: user.id},
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN')
      }
    );
    this.sendActivationEmail(newUser.email, token);
    return user;
  }

  async sendActivationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    // console.log('Generated token:', token);
    const activationLink = `${frontendUrl}/activate?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Activate your account',
      text: `Please activate your account by clicking on the following link: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async activateAccount(token: string): Promise<{ email: string; username: string } | { errorMessage: string } | null> {
    try {
      const decoded = this.jwtService.verify(token, {secret: this.configService.get('JWT_SECRET')});
      const user = await this.usersRepository.findOne({ where: { id: decoded.userId } });
      if (!user) {
        return { errorMessage: 'User not found' };
      }
      user.isActive = true;
      await this.usersRepository.save(user);
      return {
        email: user.email,
        username: user.username,
      };
    } catch (error) {
      return { errorMessage: 'Invalid or expired token' };
    }
  }
  
  private startAccountCleanupJob() {
    cron.schedule('* * * * *', async () => {
      const usersToDelete = await this.usersRepository.find({
        where: {
          isActive: false,
        },
      });

      const currentTime = new Date();
      //console.log('Current time:', currentTime.toISOString());

      const filteredUsers = usersToDelete.filter(user => {
        const createdAtTime = new Date(user.createdAt).getTime();
        //console.log(`User created at: ${new Date(user.createdAt).toISOString()}`);
        
        const diffInMinutes = (currentTime.getTime() - createdAtTime) / (1000 * 60);
        //console.log(`Diff in minutes for user ${user.id}: ${diffInMinutes.toFixed(2)} min`);
        
        return diffInMinutes >= 125;
      });

      if (filteredUsers.length > 0) {
        //console.log(`Deleting ${filteredUsers.length} inactive users at ${currentTime.toISOString()}...`);
        await this.usersRepository.remove(filteredUsers);
      } 
      // else {
      //   console.log('No users to delete.');
      // }
    });
  }

  async authenticate(input: AuthInput): Promise<AuthResult>{
    const user =  await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null>{
    const user = await this.usersService.findUserByName(input.username);

    if (user && await bcrypt.compare(input.password, user.password)){
      return {
        userId: user.id,
        username: user.username,
      }
    }

    return null;
  }
  
  async signIn (user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { accessToken, username: user.username, userId: user.userId};
  }
}