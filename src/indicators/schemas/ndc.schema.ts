import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NdcDocument = NdcIndicator & Document;

@Schema({ collection: 'ndc_indicators', strict: false, timestamps: false })
export class NdcIndicator {
  @Prop() Indicator: string;
  @Prop() Source: string;
}

export const NdcIndicatorSchema = SchemaFactory.createForClass(NdcIndicator);
