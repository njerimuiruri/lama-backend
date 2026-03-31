import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NapsDocument = NapsIndicator & Document;

@Schema({ collection: 'naps_indicators', strict: false, timestamps: false })
export class NapsIndicator {
  @Prop() Indicator: string;
  @Prop() Source: string;
}

export const NapsIndicatorSchema = SchemaFactory.createForClass(NapsIndicator);
