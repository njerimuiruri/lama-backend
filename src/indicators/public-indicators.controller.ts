import { Controller, Get } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';

/**
 * Public endpoints — no authentication required.
 * Only exposes aggregated counts, never raw data.
 */
@Controller('public/indicators')
export class PublicIndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  /** GET /public/indicators/stats — returns record counts per dataset */
  @Get('stats')
  getStats() {
    return this.indicatorsService.getCollectionCounts();
  }
}
