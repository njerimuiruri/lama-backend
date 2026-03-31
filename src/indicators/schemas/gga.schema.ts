import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GgaDocument = GgaRecord & Document;

@Schema({ collection: 'ggaindicators', strict: false, timestamps: false })
export class GgaRecord {
  @Prop() Indicator: string;
}

export const GgaRecordSchema = SchemaFactory.createForClass(GgaRecord);
