import { Body, Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
import { TrackingService, LogEventDto } from './tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlatformJwtGuard } from '../auth/platform-jwt.guard';

@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * POST /track
   * Called silently from the platform on every meaningful user action.
   * Requires a valid platform JWT.
   */
  @Post()
  @UseGuards(PlatformJwtGuard)
  async logEvent(@Body() body: any, @Req() req: any) {
    const user = req.user;

    const dto: LogEventDto = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      country: user.country,
      event: body.event || 'unknown',
      page: body.page || null,
      detail: body.detail || null,
      timeOnPage: Number(body.timeOnPage) || 0,
      ipAddress:
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.ip ||
        null,
    };

    // Fire and forget — never block the user's request
    this.trackingService.log(dto).catch((err) =>
      console.error('[Tracking] Log failed:', err.message),
    );

    return { ok: true };
  }

  /**
   * GET /track/recent — admin only
   * Returns the last 50 activity events across all users.
   */
  @Get('recent')
  @UseGuards(JwtAuthGuard)
  async getRecent(@Query('limit') limit?: string) {
    return this.trackingService.getRecentActivity(limit ? parseInt(limit) : 50);
  }

  /**
   * GET /track/user?email=x — admin only
   * Returns all activity for a specific user.
   */
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserActivity(@Query('email') email: string) {
    if (!email) return [];
    return this.trackingService.getUserActivity(email);
  }

  /**
   * GET /track/stats — admin only
   * Returns event type counts and top visited pages.
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    const [eventCounts, topPages] = await Promise.all([
      this.trackingService.getEventCounts(),
      this.trackingService.getTopPages(),
    ]);
    return { eventCounts, topPages };
  }
}
