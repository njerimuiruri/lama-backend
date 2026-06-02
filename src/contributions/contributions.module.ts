import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contribution, ContributionSchema } from './contribution.schema';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { PublicContributionsController } from './public-contributions.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Contribution.name, schema: ContributionSchema },
    ]),
  ],
  controllers: [ContributionsController, PublicContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
