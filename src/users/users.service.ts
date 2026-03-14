import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GateUser, GateUserDocument } from './gate-user.schema';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(GateUser.name) private gateUserModel: Model<GateUserDocument>,
  ) {}

  async register(dto: RegisterUserDto): Promise<GateUser> {
    const existing = await this.gateUserModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('This email is already registered.');
    }
    const user = new this.gateUserModel(dto);
    return user.save();
  }

  async verifyEmail(email: string): Promise<boolean> {
    const user = await this.gateUserModel.findOne({ email: email.toLowerCase() });
    return !!user;
  }

  async findAll(): Promise<GateUser[]> {
    return this.gateUserModel.find().sort({ createdAt: -1 }).lean();
  }
}
