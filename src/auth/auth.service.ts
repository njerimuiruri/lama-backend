import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './admin.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Seed the admin account on first startup if it doesn't exist yet */
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) return;

    const exists = await this.adminModel.findOne({ email });
    if (!exists) {
      const hash = await bcrypt.hash(password, 10);
      await this.adminModel.create({ email, password: hash });
      console.log(`[Auth] Admin seeded — email: ${email}`);
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string; email: string }> {
    const admin = await this.adminModel.findOne({ email: dto.email.toLowerCase() });
    if (!admin) throw new UnauthorizedException('Invalid credentials.');

    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    const payload = { sub: admin._id.toString(), email: admin.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token, email: admin.email };
  }
}
