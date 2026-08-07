import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  @IsPositive()
  plan_id: number;

  @IsNumber()
  @IsPositive()
  price_at_signing: number;
}