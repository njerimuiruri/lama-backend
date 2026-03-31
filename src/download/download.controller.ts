import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { DownloadService } from './download.service';
import { PlatformJwtGuard } from '../auth/platform-jwt.guard';
import { TrackingService } from '../tracking/tracking.service';

@Controller('download')
@UseGuards(PlatformJwtGuard)
export class DownloadController {
  constructor(
    private readonly downloadService: DownloadService,
    private readonly trackingService: TrackingService,
  ) {}

  /**
   * GET /download/:dataset
   * Returns a watermarked CSV file for the requested dataset.
   * Requires a valid platform JWT.
   */
  @Get(':dataset')
  async download(
    @Param('dataset') dataset: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const user = req.user;

    const csv = await this.downloadService.generateCsv(dataset, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      country: user.country,
    });

    // Log the download silently
    this.trackingService
      .log({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        country: user.country,
        event: 'download',
        page: `/indicators/${dataset}`,
        detail: `Downloaded ${dataset}.csv`,
        ipAddress:
          req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
          req.ip ||
          null,
      })
      .catch(() => {});

    const filename = `lama_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
