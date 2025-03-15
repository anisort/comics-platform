import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';
import { LessThan } from 'typeorm';
import { RegisterUserDto } from '../../dto/register.user.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    this.startAccountCleanupJob();
  }

  async register(newUser: RegisterUserDto): Promise<User> {
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const user = this.usersRepository.create(newUser);
    await this.usersRepository.save(user);
    this.sendActivationEmail(newUser.email, user.id);
    return user;
  }

  async sendActivationEmail(email: string, userId: number) {
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

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Activate your account',
      text: `Please activate your account by clicking on the following link: 
      http://localhost:3000/auth/activate/${userId}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async activateAccount(userId: number): Promise<{ message: string; username: string } | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    user.isActive = true;
    await this.usersRepository.save(user);
    return {
      message: 'Account successfully activated',
      username: user.username,
    };
  }
  

  private startAccountCleanupJob() {
    cron.schedule('* * * * *', async () => {
      const currentTime = new Date();
      const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);

      const usersToDelete = await this.usersRepository.find({
        where: {
          isActive: false,
          createdAt: LessThan(fiveMinutesAgo),
        },
      });

      if (usersToDelete.length > 0) {
        console.log(`Deleting ${usersToDelete.length} inactive users...`);
        await this.usersRepository.remove(usersToDelete);
      }
    });
  }
}