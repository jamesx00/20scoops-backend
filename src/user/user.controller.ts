import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { NewUser, newUserSchema } from './schemas/user.yup.schema';
import { ValidationError } from 'yup';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Create a new user with class validator and class transformer
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // Create a new user with yup validator
  @Post('yup')
  createUserWithYup(@Body() body: NewUser) {
    try {
      newUserSchema.validateSync(body);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.errors.join(', '),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }

    const newUserData = newUserSchema.cast(body, { stripUnknown: true });
    return this.userService.createUser(newUserData);
  }

  @Get()
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Get(':identificationNumber')
  getUserByIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
  ) {
    return this.userService.getUserByIdentificationNumber(identificationNumber);
  }

  @Patch(':identificationNumber')
  updateUserbyIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserByIdentificationNumber(
      identificationNumber,
      dto,
    );
  }

  @Delete(':identificationNumber')
  deleteUserbyIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
  ) {
    return this.userService.deleteUserByIdentificationNumber(
      identificationNumber,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('restore/:identificationNumber')
  restoreDeletedUserByIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
  ) {
    return this.userService.restoreDeletedUserByIdentificationNumber(
      identificationNumber,
    );
  }
}
