import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CidpsDocument = CidpsRecord & Document;

@Schema({ collection: 'cidpsindicators', strict: false, timestamps: false })
export class CidpsRecord {
  @Prop() Source: string;
  @Prop() PrioritySector: string;
}

export const CidpsRecordSchema = SchemaFactory.createForClass(CidpsRecord);
