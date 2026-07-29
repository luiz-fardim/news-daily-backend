import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

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
        email: data.email
      }
    })

    if (alreadyExists) {
      throw new ConflictException("Invalid Credentials")
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
    const user: { email: string, password: string, id: number } | null = await this.prismaService.user.findFirst({
      where: { email: data.email },
      select: { email: true, password: true, id: true }
    })

    if (!user) {
      throw new UnauthorizedException("Invalid Credentials")
    }
    const isMatch = await argon2.verify(user?.password, data.password)

    if (!isMatch) {
      throw new UnauthorizedException("Invalid Credentials")
    }
    const payload = { email: user.email, id: user.id}

    return await this.generateToken(payload)
  }

  async generateToken(payload: { email: string, id: number }) {
    const secret = this.configService.get<string>('secrets.jwt_secret') ?? process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = this.jwtService.sign(payload, { secret });
    return { accessToken: token };
  }
}
