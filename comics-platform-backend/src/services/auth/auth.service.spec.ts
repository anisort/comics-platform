import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { compare } from 'bcryptjs';
import { MailService } from '../mail/mail.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_secret'),
  };

  const mockMailService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return accessToken and user data if credentials are valid', async () => {
    const mockUser = {
      id: 1,
      username: 'test',
      password: 'hashed_password',
      isActive: true,
    };

    jest
      .spyOn(usersService, 'findUserByName')
      .mockResolvedValue(mockUser as User);
    (compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.authenticate({
      username: 'test',
      password: '123456',
    });

    expect(result).toEqual({
      accessToken: 'mock_token',
      username: 'test',
      userId: 1,
    });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    jest.spyOn(usersService, 'findUserByName').mockResolvedValue(null);

    await expect(
      authService.authenticate({
        username: 'notfound',
        password: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
