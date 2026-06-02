import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContributionDocument = Contribution & Document;

export type ContributionStatus = 'pending' | 'approved' | 'rejected';
export type ContributionType = 'form' | 'indicator_rows' | 'file_upload';
export type DatasetKey = 'ndc' | 'naps' | 'nccap' | 'ccap' | 'cidps' | 'lla' | 'gga' | 'global' | 'community';

@Schema({ timestamps: true })
export class Contribution {
  @Prop({ required: true })
  submitterEmail: string;

  @Prop({ required: true })
  submitterName: string;

  @Prop({ default: '' })
  submitterOrganization: string;

  @Prop({ required: true })
  submitterCountry: string;

  @Prop({ required: true, enum: ['form', 'indicator_rows', 'file_upload'] })
  type: ContributionType;

  @Prop({ required: true })
  dataset: DatasetKey;

  @Prop({ type: [Object], default: [] })
  data: Record<string, any>[];

  @Prop({ default: '' })
  fileName: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: ContributionStatus;

  @Prop({ default: '' })
  adminNotes: string;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);
ContributionSchema.index({ submitterEmail: 1 });
ContributionSchema.index({ status: 1, createdAt: -1 });
