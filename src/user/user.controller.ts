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
import {
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { UserService } from './user.service';
import {
  NewUser,
  newUserSchema,
} from './schemas/user.yup.schema';
import { ValidationError } from 'yup';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Create a new user with class validator and class transformer
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization code',
  })
  @ApiResponse({
    status: 403,
    description:
      'The authorization code is invalid',
  })
  @ApiResponse({
    status: 201,
    description:
      'The user is created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Provided body data is invalid',
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // Create a new user with yup validator
  @Post('yup')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization code',
  })
  @ApiOperation({
    summary:
      'Create a new user but with yup as a validator. All parameters are the same as POST /users',
  })
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

    const newUserData = newUserSchema.cast(body, {
      stripUnknown: true,
    });
    return this.userService.createUser(
      newUserData,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  getAllUser() {
    return this.userService.getAllUsers();
  }

  @Get(':identificationNumber')
  @ApiOperation({
    summary:
      'Get single user with the identification number',
  })
  @ApiResponse({
    status: 200,
    description:
      'The user is found in the database',
  })
  @ApiResponse({
    status: 404,
    description:
      'The user has been deleted or never existed',
  })
  getUserByIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
  ) {
    return this.userService.getUserByIdentificationNumber(
      identificationNumber,
    );
  }

  @Patch(':identificationNumber')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization code',
  })
  @ApiOperation({
    summary:
      'Update a user with the provided identification number',
  })
  @ApiResponse({
    status: 200,
    description:
      'The user has been updated successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'The user has been deleted or never existed',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization code',
  })
  @ApiOperation({
    summary:
      'Delete the user with the provided identifier number',
  })
  @ApiResponse({
    status: 200,
    description:
      'The user has been deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'The user has been deleted or never existed',
  })
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
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization code',
  })
  @ApiOperation({
    summary:
      'Restore deleted the user with the provided identifier number',
  })
  @ApiResponse({
    status: 200,
    description:
      'The user has been restored successfully',
  })
  @ApiResponse({
    status: 404,
    description:
      'The user is live or never existed',
  })
  restoreDeletedUserByIdenficiationNumber(
    @Param('identificationNumber')
    identificationNumber: string,
  ) {
    return this.userService.restoreDeletedUserByIdentificationNumber(
      identificationNumber,
    );
  }
}
