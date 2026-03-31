import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { IndicatorsModule } from './indicators/indicators.module';
import { TrackingModule } from './tracking/tracking.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 600000, // 10 minutes in ms
        limit: 100,  // max 100 requests per 10 min per IP
      },
    ]),
    UsersModule,
    AuthModule,
    MailModule,
    IndicatorsModule,
    TrackingModule,
    DownloadModule,
  ],
})
export class AppModule {}
