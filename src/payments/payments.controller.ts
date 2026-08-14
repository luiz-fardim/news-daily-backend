import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto)
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll()
  }

  @Post('process-payment')
  processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(processPaymentDto)
  }
}
