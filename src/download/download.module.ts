import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { AuthModule } from '../auth/auth.module';
import { TrackingModule } from '../tracking/tracking.module';
import { NdcIndicator, NdcIndicatorSchema } from '../indicators/schemas/ndc.schema';
import { NapsIndicator, NapsIndicatorSchema } from '../indicators/schemas/naps.schema';
import { NccapRecord, NccapRecordSchema } from '../indicators/schemas/nccap.schema';
import { CidpsRecord, CidpsRecordSchema } from '../indicators/schemas/cidps.schema';
import { CcapRecord, CcapRecordSchema } from '../indicators/schemas/ccap.schema';
import { LlaRecord, LlaRecordSchema } from '../indicators/schemas/lla.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NdcIndicator.name, schema: NdcIndicatorSchema },
      { name: NapsIndicator.name, schema: NapsIndicatorSchema },
      { name: NccapRecord.name, schema: NccapRecordSchema },
      { name: CidpsRecord.name, schema: CidpsRecordSchema },
      { name: CcapRecord.name, schema: CcapRecordSchema },
      { name: LlaRecord.name, schema: LlaRecordSchema },
    ]),
    AuthModule,
    TrackingModule,
  ],
  controllers: [DownloadController],
  providers: [DownloadService],
})
export class DownloadModule {}
