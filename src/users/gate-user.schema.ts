import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GateUserDocument = GateUser & Document;

@Schema({ timestamps: true })
export class GateUser {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: '' })
  organization: string;

  @Prop({ required: true })
  purpose: string;
}

export const GateUserSchema = SchemaFactory.createForClass(GateUser);
