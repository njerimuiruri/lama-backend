import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NdcIndicator, NdcDocument } from '../indicators/schemas/ndc.schema';
import { NapsIndicator, NapsDocument } from '../indicators/schemas/naps.schema';
import { NccapRecord, NccapDocument } from '../indicators/schemas/nccap.schema';
import { CidpsRecord, CidpsDocument } from '../indicators/schemas/cidps.schema';
import { CcapRecord, CcapDocument } from '../indicators/schemas/ccap.schema';
import { LlaRecord, LlaDocument } from '../indicators/schemas/lla.schema';

export interface DownloadUser {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  country: string;
}

@Injectable()
export class DownloadService {
  private readonly datasetMap: Record<string, Model<any>>;

  constructor(
    @InjectModel(NdcIndicator.name) private ndcModel: Model<NdcDocument>,
    @InjectModel(NapsIndicator.name) private napsModel: Model<NapsDocument>,
    @InjectModel(NccapRecord.name) private nccapModel: Model<NccapDocument>,
    @InjectModel(CidpsRecord.name) private cidpsModel: Model<CidpsDocument>,
    @InjectModel(CcapRecord.name) private ccapModel: Model<CcapDocument>,
    @InjectModel(LlaRecord.name) private llaModel: Model<LlaDocument>,
  ) {
    this.datasetMap = {
      ndc: this.ndcModel,
      naps: this.napsModel,
      nccap: this.nccapModel,
      cidps: this.cidpsModel,
      ccap: this.ccapModel,
      lla: this.llaModel,
    };
  }

  async generateCsv(dataset: string, user: DownloadUser): Promise<string> {
    const model = this.datasetMap[dataset.toLowerCase()];
    if (!model) throw new NotFoundException(`Dataset "${dataset}" not found.`);

    const records = await model.find({}, { __v: 0, _id: 0 }).lean();
    if (!records.length) return '';

    // Build watermark header — embedded at the top of every file
    const watermark = [
      `# Source: LAMA Platform — lama-arin-africa.org`,
      `# Downloaded by: ${user.firstName} ${user.lastName} <${user.email}>`,
      `# Organisation: ${user.organization || 'Not specified'}`,
      `# Country: ${user.country}`,
      `# Date: ${new Date().toISOString()}`,
      `# License: Not for redistribution without permission`,
      `#`,
    ].join('\n');

    // Build CSV from records
    const keys = Object.keys(records[0]);
    const header = keys.map((k) => `"${k}"`).join(',');
    const rows = records.map((r) =>
      keys
        .map((k) => {
          const val = r[k] ?? '';
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(','),
    );

    return `${watermark}\n${header}\n${rows.join('\n')}`;
  }
}
