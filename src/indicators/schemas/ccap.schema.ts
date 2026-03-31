import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CcapDocument = CcapRecord & Document;

@Schema({ collection: 'ccap_indicators', strict: false, timestamps: false })
export class CcapRecord {
  @Prop() Source: string;
  @Prop() Activity: string;
}

export const CcapRecordSchema = SchemaFactory.createForClass(CcapRecord);
