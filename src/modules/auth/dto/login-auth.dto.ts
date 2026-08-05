import { IsEmail, Length } from "class-validator"

export class LoginAuthDto {
    @IsEmail()
    @Length(8, 30)
    email: string

    @Length(8, 20)
    password: string
}