import { IsString, IsEmail } from 'class-validator';

export class CreateContactDto {
  @IsString()
  readonly name!: string;

  @IsEmail()
  readonly email!: string;

  @IsString()
  readonly subject!: string;

  @IsString()
  readonly message!: string;
}
