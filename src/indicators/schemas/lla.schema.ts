import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LlaDocument = LlaRecord & Document;

@Schema({ collection: 'llaindicators', strict: false, timestamps: false })
export class LlaRecord {
  @Prop() thematicSector: string;
}

export const LlaRecordSchema = SchemaFactory.createForClass(LlaRecord);
