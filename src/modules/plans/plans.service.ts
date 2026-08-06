import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlansService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}
  async create(data: CreatePlanDto) {
    const plan = await this.prismaService.plan.create({
      data: {
        name: data.name,
        price: data.price,
        billing_interval: data.billing_interval,
      }
    });
    return plan;
  }

  findAll() {
    return this.prismaService.plan.findMany();
  }

  findOne(id: number) {
    return this.prismaService.plan.findUnique({
      where: { id }
    });
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return this.prismaService.plan.update({
      where: { id },
      data: {
        name: updatePlanDto.name,
        price: updatePlanDto.price,
        billing_interval: updatePlanDto.billing_interval,
      }
    });
  }

  async remove(id: number) {
    await this.prismaService.plan.delete({
      where: { id }
    });
    return { message: `Plan with id ${id} has been deleted.` };
  }
}
