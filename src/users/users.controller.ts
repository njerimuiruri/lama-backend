import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GateUser } from './gate-user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  private issuePlatformToken(user: GateUser & { _id?: any }): string {
    const payload = {
      sub: user._id?.toString() ?? user.email,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization || '',
      country: user.country,
      role: 'platform',
    };
    return this.jwtService.sign(payload);
  }

  /** POST /users/register — called by the LAMA platform content gate */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.usersService.register(dto);

    this.mailService.sendWelcomeEmail(user).catch((err) =>
      console.error('[Mail] Welcome email failed:', err.message),
    );

    const access_token = this.issuePlatformToken(user as any);
    return { success: true, message: 'Registration successful.', access_token };
  }

  /** POST /users/verify-email — returning user quick-access check */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('email') email: string) {
    if (!email) return { found: false };

    const user = await this.usersService.findByEmail(email);
    if (!user) return { found: false };

    const access_token = this.issuePlatformToken(user as any);
    return { found: true, access_token };
  }

  /** GET /users — admin only: list all registered users */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  /** DELETE /users/:id — admin only: remove a registered user */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteById(id);
    return { success: true, message: 'User removed.' };
  }
}
