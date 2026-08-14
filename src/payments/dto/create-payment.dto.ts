import { IsInt, IsPositive, IsString } from "class-validator"
import { MethodEnum } from "src/generated/prisma/enums"

export class CreatePaymentDto {
    @IsPositive()
    @IsInt()
    amount: number

    @IsString()
    method: MethodEnum

    @IsInt()
    subscription_id: number
}

