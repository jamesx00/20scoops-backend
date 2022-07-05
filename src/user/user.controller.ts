import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
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
}
