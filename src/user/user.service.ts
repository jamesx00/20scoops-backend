import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const identificationNumber = dto.identificationNumber;

    const existingUser = await this.userModel.findOne({
      identificationNumber: identificationNumber,
    });

    if (existingUser) {
      throw new HttpException(
        `Identification number ${identificationNumber} is already taken`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  getAllUsers() {
    const allUsers = this.userModel.find({ deleted: false }).exec();
    return allUsers;
  }

  async getUserByIdentificationNumber(identificationNumber: string) {
    const user = await this.userModel
      .findOne({
        identificationNumber: identificationNumber,
        deleted: false,
      })
      .exec();

    if (!user) {
      this.throwUserNotFound();
    }

    return user;
  }

  async updateUserByIdentificationNumber(
    identificationNumber: string,
    dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        identificationNumber: identificationNumber,
        deleted: false,
      },
      { ...dto, dateUpdated: Date.now() },
      { new: true },
    );

    if (!updatedUser) {
      this.throwUserNotFound();
    }

    return updatedUser;
  }

  async deleteUserByIdentificationNumber(identificationNumber: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        identificationNumber: identificationNumber,
        deleted: false,
      },
      {
        deleted: true,
        dateDeleted: Date.now(),
      },
    );

    if (!updatedUser) {
      this.throwUserNotFound();
    }

    return { deleted: true };
  }

  async restoreDeletedUserByIdentificationNumber(identificationNumber: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        identificationNumber: identificationNumber,
        deleted: true,
      },
      {
        deleted: false,
        dateDeleted: null,
      },
      { new: true },
    );

    if (!updatedUser) {
      this.throwUserNotFound();
    }
    return updatedUser;
  }

  throwUserNotFound() {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
