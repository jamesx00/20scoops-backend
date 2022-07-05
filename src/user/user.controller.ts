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
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
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
