import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IndicatorsService } from './indicators.service';
import { IndicatorsController } from './indicators.controller';
import { PublicIndicatorsController } from './public-indicators.controller';
import { AuthModule } from '../auth/auth.module';
import { NdcIndicator, NdcIndicatorSchema } from './schemas/ndc.schema';
import { NapsIndicator, NapsIndicatorSchema } from './schemas/naps.schema';
import { NccapRecord, NccapRecordSchema } from './schemas/nccap.schema';
import { CidpsRecord, CidpsRecordSchema } from './schemas/cidps.schema';
import { CcapRecord, CcapRecordSchema } from './schemas/ccap.schema';
import { LlaRecord, LlaRecordSchema } from './schemas/lla.schema';
import { GgaRecord, GgaRecordSchema } from './schemas/gga.schema';
import { GlobalRecord, GlobalRecordSchema } from './schemas/global.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: NdcIndicator.name, schema: NdcIndicatorSchema },
      { name: NapsIndicator.name, schema: NapsIndicatorSchema },
      { name: NccapRecord.name, schema: NccapRecordSchema },
      { name: CidpsRecord.name, schema: CidpsRecordSchema },
      { name: CcapRecord.name, schema: CcapRecordSchema },
      { name: LlaRecord.name, schema: LlaRecordSchema },
      { name: GgaRecord.name, schema: GgaRecordSchema },
      { name: GlobalRecord.name, schema: GlobalRecordSchema },
    ]),
  ],
  controllers: [IndicatorsController, PublicIndicatorsController],
  providers: [IndicatorsService],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
