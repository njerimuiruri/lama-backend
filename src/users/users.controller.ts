import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /** POST /users/register — called by the Lama platform content gate */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.usersService.register(dto);

    // Send welcome email (fire-and-forget, don't fail if email fails)
    this.mailService.sendWelcomeEmail(user).catch((err) =>
      console.error('[Mail] Welcome email failed:', err.message),
    );

    return { success: true, message: 'Registration successful.' };
  }

  /** POST /users/verify-email — returning user quick-access check */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('email') email: string) {
    if (!email) {
      return { found: false };
    }
    const found = await this.usersService.verifyEmail(email);
    return { found };
  }

  /** GET /users — admin only: list all registered users */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
