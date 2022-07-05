import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  identificationNumber: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  history?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  history?: string;
}
