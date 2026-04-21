import { Controller, Get, Query } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';

@Controller('public/indicators')
export class PublicIndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  private parsePage(query: any) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(query.limit) || 500));
    return { page, limit };
  }

  @Get('stats')
  getStats() {
    return this.indicatorsService.getCollectionCounts();
  }

  @Get('ndc')
  getNdc(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findNdc(page, limit);
  }

  @Get('naps')
  getNaps(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findNaps(page, limit);
  }

  @Get('nccap')
  getNccap(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findNccap(page, limit);
  }

  @Get('cidps')
  getCidps(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findCidps(page, limit);
  }

  @Get('ccap')
  getCcap(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findCcap(page, limit);
  }

  @Get('lla')
  getLla(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findLla(page, limit);
  }

  @Get('gga')
  getGga(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findGga(page, limit);
  }

  @Get('global')
  getGlobal(@Query() query: any) {
    const { page, limit } = this.parsePage(query);
    return this.indicatorsService.findGlobal(page, limit);
  }
}
