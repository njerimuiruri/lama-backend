import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NdcIndicator, NdcDocument } from './schemas/ndc.schema';
import { NapsIndicator, NapsDocument } from './schemas/naps.schema';
import { NccapRecord, NccapDocument } from './schemas/nccap.schema';
import { CidpsRecord, CidpsDocument } from './schemas/cidps.schema';
import { CcapRecord, CcapDocument } from './schemas/ccap.schema';
import { LlaRecord, LlaDocument } from './schemas/lla.schema';
import { GgaRecord, GgaDocument } from './schemas/gga.schema';
import { GlobalRecord, GlobalDocument } from './schemas/global.schema';

export interface PageResult {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectModel(NdcIndicator.name) private ndcModel: Model<NdcDocument>,
    @InjectModel(NapsIndicator.name) private napsModel: Model<NapsDocument>,
    @InjectModel(NccapRecord.name) private nccapModel: Model<NccapDocument>,
    @InjectModel(CidpsRecord.name) private cidpsModel: Model<CidpsDocument>,
    @InjectModel(CcapRecord.name) private ccapModel: Model<CcapDocument>,
    @InjectModel(LlaRecord.name) private llaModel: Model<LlaDocument>,
    @InjectModel(GgaRecord.name) private ggaModel: Model<GgaDocument>,
    @InjectModel(GlobalRecord.name) private globalModel: Model<GlobalDocument>,
  ) {}

  private async paginate(
    model: Model<any>,
    page: number,
    limit: number,
    filter: Record<string, any> = {},
  ): Promise<PageResult> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100); // cap at 100 per request
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      model.find(filter, { __v: 0 }).skip(skip).limit(safeLimit).lean(),
      model.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }

  findNdc(page: number, limit: number) {
    return this.paginate(this.ndcModel, page, limit);
  }

  findNaps(page: number, limit: number) {
    return this.paginate(this.napsModel, page, limit);
  }

  findNccap(page: number, limit: number) {
    return this.paginate(this.nccapModel, page, limit);
  }

  findCidps(page: number, limit: number) {
    return this.paginate(this.cidpsModel, page, limit);
  }

  findCcap(page: number, limit: number) {
    return this.paginate(this.ccapModel, page, limit);
  }

  findLla(page: number, limit: number) {
    return this.paginate(this.llaModel, page, limit);
  }

  findGga(page: number, limit: number) {
    return this.paginate(this.ggaModel, page, limit);
  }

  findGlobal(page: number, limit: number) {
    return this.paginate(this.globalModel, page, limit);
  }

  async getCollectionCounts() {
    const [ndc, naps, nccap, cidps, ccap, lla, gga, global_] =
      await Promise.all([
        this.ndcModel.countDocuments(),
        this.napsModel.countDocuments(),
        this.nccapModel.countDocuments(),
        this.cidpsModel.countDocuments(),
        this.ccapModel.countDocuments(),
        this.llaModel.countDocuments(),
        this.ggaModel.countDocuments(),
        this.globalModel.countDocuments(),
      ]);
    return { ndc, naps, nccap, cidps, ccap, lla, gga, global: global_ };
  }
}
