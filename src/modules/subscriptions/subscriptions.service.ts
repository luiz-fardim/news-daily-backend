import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateSubscriptionDto, request: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: data.plan_id,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    const existingSubscription =
      await this.prismaService.subscription.findFirst({
        where: {
          user_id: user.id,
          status: "ACTIVE", // ajusta o valor conforme seu enum/schema
        },
      });

    if (existingSubscription) {
      throw new ConflictException('Usuário já possui uma assinatura ativa');
    }

    const subs = await this.prismaService.subscription.create({
      data: {
        ...data,
        user_id: user.id,
        plan_id: plan.id,
        expires_at: this.calculateExpiresAt(),
      },
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

  async findAll(page = 1, limit = 10) {
    const take = limit;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prismaService.subscription.findMany({ skip, take }),
      this.prismaService.subscription.count(),
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

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
