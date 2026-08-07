import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateSubscriptionDto, request: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: request.email
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: data.plan_id
      }
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const subs = await this.prismaService.subscription.create({
      data: {
        ...data,
        user_id: user.id, 
        plan_id: plan.id,
        expires_at: this.calculateExpiresAt()
      }
    });

    return subs; 
  }

  private calculateExpiresAt(startDate: Date = new Date()): Date {
    const result = new Date(startDate);
    const originalDay = result.getDate();
    result.setMonth(result.getMonth() + 1);

    if (result.getDate() !== originalDay) {
      result.setDate(0);
    }

    return result;
  }

  async findAll() {
    return await this.prismaService.subscription.findMany()
  }

  async findOne(id: number) {
    return await this.prismaService.subscription.findUnique({
      where: {
        id: id
      }
    })
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return await this.prismaService.subscription.update({
      where: { id },
      data: {
        plan_id: updateSubscriptionDto.plan_id,
        price_at_signing: updateSubscriptionDto.price_at_signing
      }
    });
  }

  async remove(id: number) {
    return await this.prismaService.subscription.delete({
      where: {
        id: id
      }
    })
  }
}