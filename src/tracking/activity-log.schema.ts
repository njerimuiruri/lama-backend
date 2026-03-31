import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true, collection: 'activity_logs' })
export class ActivityLog {
  @Prop({ required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  organization: string;

  @Prop()
  country: string;

  @Prop({ required: true })
  event: string; // 'page_visit' | 'login' | 'table_view' | 'download' | 'tab_switch' | 'filter_used'

  @Prop()
  page: string; // e.g. '/indicators/National_NDC'

  @Prop()
  detail: string; // e.g. 'Opened NDC table', 'Downloaded ndc.csv'

  @Prop({ default: 0 })
  timeOnPage: number; // seconds

  @Prop()
  ipAddress: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

// Index for fast admin queries
ActivityLogSchema.index({ email: 1 });
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ event: 1 });
