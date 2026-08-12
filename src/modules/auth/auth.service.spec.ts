import { ConflictException, UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  verify: jest.fn().mockResolvedValue(true),
} as any));

describe('AuthService', () => {
  let service: AuthService;
  const prismaMock: any = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  const jwtMock: Partial<JwtService> = { sign: jest.fn().mockReturnValue('access-token') };
  const configMock: Partial<ConfigService> = { get: jest.fn().mockReturnValue('secret') };

  beforeEach(() => {
    prismaMock.user.findFirst.mockReset();
    prismaMock.user.create.mockReset();
    prismaMock.refreshToken.create.mockReset();
    (jwtMock.sign as jest.Mock).mockClear();
    (configMock.get as jest.Mock).mockClear();

    service = new AuthService(prismaMock as any, jwtMock as any, configMock as any);
  });

  it('should create a user and return without password', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 1, email: 'a@b.com', password: 'hashed-password' });

    const res = await service.create({ email: 'a@b.com', password: '123', birthday: '2000-01-01' } as any);
    expect(prismaMock.user.findFirst).toHaveBeenCalled();
    expect(prismaMock.user.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 1, email: 'a@b.com' });
  });

  it('should throw ConflictException if user exists', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com' });
    await expect(service.create({ email: 'a@b.com', password: '123', birthday: '2000-01-01' } as any)).rejects.toBeInstanceOf(ConflictException);
  });

  it('should throw UnauthorizedException when user not found on compare', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    await expect(service.compare({ email: 'not@found', password: 'x' } as any)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('should return tokens on successful compare', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com', password: 'hashed', role: 'USER' });
    // argon2.verify is mocked to true
    prismaMock.refreshToken.create.mockResolvedValue({});
    (jwtMock.sign as jest.Mock).mockReturnValue('signed-token');

    const tokens = await service.compare({ email: 'a@b.com', password: '123' } as any);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  it('generateTokens should call prisma and jwt', async () => {
    prismaMock.refreshToken.create.mockResolvedValue({});
    (jwtMock.sign as jest.Mock).mockReturnValue('signed-token');

    const out = await service.generateTokens('1', 'a@b.com', 'USER' as any);
    expect(out.accessToken).toBeDefined();
    expect(out.refreshToken).toBeDefined();
    expect(prismaMock.refreshToken.create).toHaveBeenCalled();
  });

});
