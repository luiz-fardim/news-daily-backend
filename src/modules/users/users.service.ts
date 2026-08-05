import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number, requestUserId: number) {
  const user = await this.prismaService.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  console.log(user.id, requestUserId)
  if (user.id !== requestUserId) {
    throw new ForbiddenException("You can't access here");
  }
  return user;
}

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
  const user = await this.prismaService.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return this.prismaService.user.delete({
    where: { id },
  });
}
}