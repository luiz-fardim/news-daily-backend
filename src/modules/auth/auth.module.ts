import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/guards/strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('secrets.jwt_secret') ?? process.env.JWT_SECRET;

        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not configured');
        }

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '1min' },
        };
      },
    }),
  ],
})
export class AuthModule {}
