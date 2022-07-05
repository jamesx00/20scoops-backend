import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  identificationNumber: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  history: string;

  @Prop({ required: true, default: Date.now })
  dateCreated: Date;

  @Prop({ required: true, default: Date.now })
  dateUpdated: Date;

  @Prop({ required: true, default: false })
  deleted: boolean;

  @Prop()
  dateDeleted: Date;
}

export const UserSchema =
  SchemaFactory.createForClass(User);
