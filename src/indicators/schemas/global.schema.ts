import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GlobalDocument = GlobalRecord & Document;

@Schema({ collection: 'globalindicators', strict: false, timestamps: false })
export class GlobalRecord {
  @Prop() Indicator: string;
  @Prop() Category: string;
  @Prop() Submission: string;
}

export const GlobalRecordSchema = SchemaFactory.createForClass(GlobalRecord);
