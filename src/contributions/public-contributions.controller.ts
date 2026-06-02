import { Controller, Get, Param } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

@Controller('public/contributions')
export class PublicContributionsController {
  constructor(private readonly service: ContributionsService) {}

  /** GET /public/contributions/:dataset — unauthenticated, approved rows only */
  @Get(':dataset')
  forDataset(@Param('dataset') dataset: string) {
    return this.service.findApprovedForDataset(dataset);
  }
}
