import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';
import argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) { }
  async create(data: CreateAuthDto) {
    const hash = await argon2.hash(data.password)
    data.password = hash

    const user = await this.prismaService.user.create({
      data: {
        ...data, birthday: new Date(data.birthday)
      }
    })
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
