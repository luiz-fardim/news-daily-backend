import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { SubscriptionStatus } from 'src/generated/prisma/browser';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(page = 1, limit = 10, subscriptionStatus?: string) {
    const take = limit;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prismaService.user.findMany({ skip, take }),
      this.prismaService.user.count(),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, requestUserId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.id !== requestUserId) {
      throw new ForbiddenException("You can't access here");
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    requestUserId: number,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.id !== requestUserId) {
      throw new ForbiddenException("You can't access here");
    }
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number, requestUserId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (user.id !== requestUserId) {
      throw new ForbiddenException("You can't access here");
    }
    await this.prismaService.user.delete({
      where: { id },
    });
    return { message: `User with ID ${id} has been deleted` };
  }
}
