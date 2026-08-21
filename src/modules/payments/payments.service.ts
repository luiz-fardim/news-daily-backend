import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.prismaService.payment.create({
      data: {
        ...createPaymentDto,
        amount: createPaymentDto.amount,
        method: createPaymentDto.method,
      },
    });
  }

  async findAll() {
    return await this.prismaService.payment.findMany();
  }

  async processPayment(processPaymentDto: ProcessPaymentDto) {
    if (processPaymentDto.aproved == true) {
      return await this.prismaService.payment.update({
        where: { id: processPaymentDto.payment_id },
        data: {
          status: 'APPROVED',
        },
      });
    } else {
      return await this.prismaService.payment.update({
        where: { id: processPaymentDto.payment_id },
        data: { status: 'CANCELED' },
      });
    }
  }
}
