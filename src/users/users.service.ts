import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findByEmail(email: string): Promise<GateUser | null> {
    return this.gateUserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  async findAll(): Promise<GateUser[]> {
    return this.gateUserModel.find().sort({ createdAt: -1 }).lean();
  }

  async deleteById(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found.');
    }
    const result = await this.gateUserModel.deleteOne({ _id: new Types.ObjectId(id) });
    if (result.deletedCount === 0) throw new NotFoundException('User not found.');
  }
}
