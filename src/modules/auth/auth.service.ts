import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { createHash, randomBytes } from 'crypto';
import { Role } from 'src/generated/prisma/browser';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(data: CreateAuthDto) {
    const alreadyExists = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (alreadyExists) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hash = await argon2.hash(data.password);
    data.password = hash;

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        birthday: new Date(data.birthday),
      },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async compare(data: LoginAuthDto) {
    const user: { email: string; password: string; id: number, role: Role } | null =
      await this.prismaService.user.findFirst({
        where: { email: data.email },
        select: { email: true, password: true, id: true, role: true },
      });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const ramdomHash = randomBytes(64).toString('hex');
    const isMatch = await argon2.verify(user?.password ?? ramdomHash, data.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload = { email: user.email, id: user.id, role: user.role };

    return await this.generateTokens(payload.id.toString(), payload.email, payload.role);
  }

  async generateTokens(userId: string, email: string, role: Role) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      { secret, expiresIn: '15m' },
    );

    const refreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    await this.prismaService.refreshToken.create({
      data: {
        user_id: parseInt(userId),
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async refreshTokens(oldRefreshToken: string) {
    const tokenHash = this.hashToken(oldRefreshToken);

    const stored = await this.prismaService.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (stored.revoked) {
      await this.revokeAllUserTokens(stored.user_id.toString());
      throw new UnauthorizedException(
        'Token reutilizado, sessão revogada por segurança',
      );
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    await this.prismaService.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    return this.generateTokens(stored.user_id.toString(), stored.user.email, stored.user.role);
  }

  async revokeAllUserTokens(userId: string) {
    await this.prismaService.refreshToken.updateMany({
      where: { user_id: parseInt(userId) },
      data: { revoked: true },
    });
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prismaService.refreshToken.deleteMany({ where: { tokenHash } });
  }
}
