import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './activity-log.schema';

export interface LogEventDto {
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  country?: string;
  event: string;
  page?: string;
  detail?: string;
  timeOnPage?: number;
  ipAddress?: string;
}

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async log(dto: LogEventDto): Promise<void> {
    await this.activityLogModel.create(dto);
  }

  async getRecentActivity(limit = 50) {
    return this.activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getUserActivity(email: string) {
    return this.activityLogModel
      .find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getEventCounts() {
    return this.activityLogModel.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  async getTopPages(limit = 10) {
    return this.activityLogModel.aggregate([
      { $match: { event: 'page_visit', page: { $exists: true, $ne: null } } },
      { $group: { _id: '$page', visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: limit },
    ]);
  }
}
