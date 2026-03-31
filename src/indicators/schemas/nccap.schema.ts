import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NccapDocument = NccapRecord & Document;

@Schema({ collection: 'nccapindicators', strict: false, timestamps: false })
export class NccapRecord {
  @Prop() PrioritySector: string;
  @Prop() PriorityAction: string;
}

export const NccapRecordSchema = SchemaFactory.createForClass(NccapRecord);
