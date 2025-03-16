import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';
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

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const activationLink = `${frontendUrl}/activate/${userId}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Activate your account',
      text: `Please activate your account by clicking on the following link: ${activationLink}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async activateAccount(userId: number): Promise<{ email: string; username: string } | { errorMessage: string } | null> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        return { errorMessage: 'User does not exist' };
      }
      user.isActive = true;
      await this.usersRepository.save(user);
      return {
        email: user.email,
        username: user.username,
      };
    } catch (error) {
      return { errorMessage: 'An error occurred during account activation' };
    }
  }
  


  async checkUsernameOrEmail(value: string): Promise<{ exists: boolean }> {
    const user = await this.usersRepository.findOne({
      where: [
        { username: value },
        { email: value },
      ],
    });
    return { exists: !!user };
  }
  

  private startAccountCleanupJob() {
    cron.schedule('* * * * *', async () => {
      const usersToDelete = await this.usersRepository.find({
        where: {
          isActive: false,
        },
      });

      const currentTime = new Date();
      console.log('Current time:', currentTime.toISOString());

      const filteredUsers = usersToDelete.filter(user => {
        const createdAtTime = new Date(user.createdAt).getTime();
        console.log(`User created at: ${new Date(user.createdAt).toISOString()}`);
        
        const diffInMinutes = (currentTime.getTime() - createdAtTime) / (1000 * 60);
        console.log(`Diff in minutes for user ${user.id}: ${diffInMinutes.toFixed(2)} min`);
        
        return diffInMinutes >= 125;
      });

      if (filteredUsers.length > 0) {
        console.log(`Deleting ${filteredUsers.length} inactive users at ${currentTime.toISOString()}...`);
        await this.usersRepository.remove(filteredUsers);
      } else {
        console.log('No users to delete.');
      }
    });
  }
  
  
  
  

}