import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { PlatformJwtGuard } from '../auth/platform-jwt.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  /** POST /contributions — authenticated platform user submits data */
  @UseGuards(PlatformJwtGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateContributionDto, @Request() req: any) {
    const { email, firstName, lastName, organization, country } = req.user;
    const contribution = await this.service.create(dto, {
      email,
      firstName,
      lastName,
      organization,
      country,
    });
    return { success: true, id: (contribution as any)._id };
  }

  /** GET /contributions/mine — platform user sees their own submissions */
  @UseGuards(PlatformJwtGuard)
  @Get('mine')
  async mine(@Request() req: any) {
    return this.service.findByEmail(req.user.email);
  }

  /** GET /contributions/stats — admin: submission stats */
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async stats() {
    return this.service.getStats();
  }

  /** GET /contributions — admin: list all (optionally filter by status) */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  /** PATCH /contributions/:id/approve — admin: approve */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Body('adminNotes') notes?: string) {
    const doc = await this.service.approve(id, notes);
    return { success: true, status: doc.status };
  }

  /** PATCH /contributions/:id/reject — admin: reject */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Body('adminNotes') notes?: string) {
    const doc = await this.service.reject(id, notes);
    return { success: true, status: doc.status };
  }

  /** GET /contributions/dataset/:dataset — merged community rows for a dataset */
  @UseGuards(PlatformJwtGuard)
  @Get('dataset/:dataset')
  async forDataset(@Param('dataset') dataset: string) {
    return this.service.findApprovedForDataset(dataset);
  }
}
