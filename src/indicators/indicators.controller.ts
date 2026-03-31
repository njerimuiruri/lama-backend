import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IndicatorsService } from './indicators.service';
import { PlatformJwtGuard } from '../auth/platform-jwt.guard';

@Controller('indicators')
@UseGuards(PlatformJwtGuard)
@Throttle({ default: { ttl: 600000, limit: 100 } }) // 100 requests per 10 min per IP
export class IndicatorsController {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  private watermark(req: any) {
    const user = req.user;
    return {
      source: 'LAMA Platform — lama-arin-africa.org',
      license: 'Not for redistribution without permission',
      accessedBy: user?.email ?? 'unknown',
      name: user ? `${user.firstName} ${user.lastName}`.trim() : 'unknown',
      organization: user?.organization || 'Not specified',
      country: user?.country ?? 'unknown',
      accessedOn: new Date().toISOString(),
    };
  }

  private parsePagination(query: any) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    return { page, limit };
  }

  @Get('ndc')
  async getNdc(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findNdc(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('naps')
  async getNaps(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findNaps(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('nccap')
  async getNccap(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findNccap(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('cidps')
  async getCidps(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findCidps(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('ccap')
  async getCcap(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findCcap(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('lla')
  async getLla(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findLla(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('gga')
  async getGga(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findGga(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }

  @Get('global')
  async getGlobal(@Query() query: any, @Request() req: any) {
    const { page, limit } = this.parsePagination(query);
    const result = await this.indicatorsService.findGlobal(page, limit);
    return { ...result, _watermark: this.watermark(req) };
  }
}
