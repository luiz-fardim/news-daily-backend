import { Type } from 'class-transformer';
import { IsDate, IsEmail, Length } from 'class-validator'

export class CreateAuthDto {
  @Length(3, 20)
  first_name: string;

  @Length(3, 30)
  last_name: string;

  @IsDate()
  @Type(() => Date)
  @IsDate({ message: "A data informada não é válida"})
  birthday: string;

  @IsEmail()
  @Length(10, 30)
  email: string;

  @Length(8, 20)
  password: string;
}
    