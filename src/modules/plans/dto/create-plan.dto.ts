import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator"
import { BillingInterval } from "src/generated/prisma/enums"

export class CreatePlanDto {
  @IsString()
  name: string

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number

  @IsEnum(BillingInterval)
  billing_interval: BillingInterval
}