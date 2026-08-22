import { IsBoolean, IsPositive } from 'class-validator';

export class ProcessPaymentDto {
  @IsPositive()
  payment_id: number;

  @IsBoolean()
  aproved: boolean;
}
