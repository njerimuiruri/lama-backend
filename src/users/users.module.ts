import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GateUser, GateUserSchema } from './gate-user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GateUser.name, schema: GateUserSchema }]),
    MailModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
