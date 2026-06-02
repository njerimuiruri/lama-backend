import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contribution, ContributionDocument } from './contribution.schema';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectModel(Contribution.name)
    private readonly model: Model<ContributionDocument>,
  ) {}

  async create(
    dto: CreateContributionDto,
    submitter: { email: string; firstName: string; lastName: string; organization: string; country: string },
  ): Promise<Contribution> {
    return this.model.create({
      submitterEmail: submitter.email,
      submitterName: `${submitter.firstName} ${submitter.lastName}`.trim(),
      submitterOrganization: submitter.organization || '',
      submitterCountry: submitter.country,
      type: dto.type,
      dataset: dto.dataset,
      data: dto.data,
      fileName: dto.fileName || '',
      description: dto.description || '',
      status: 'pending',
    });
  }

  /** Platform user: see only their own submissions */
  findByEmail(email: string) {
    return this.model
      .find({ submitterEmail: email })
      .sort({ createdAt: -1 })
      .lean();
  }

  /** Admin: list all with optional status filter */
  findAll(status?: string) {
    const filter = status ? { status } : {};
    return this.model.find(filter).sort({ createdAt: -1 }).lean();
  }

  /** Admin: approve a submission */
  async approve(id: string, adminNotes?: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Contribution not found');
    doc.status = 'approved';
    doc.adminNotes = adminNotes || '';
    return doc.save();
  }

  /** Admin: reject a submission */
  async reject(id: string, adminNotes?: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Contribution not found');
    doc.status = 'rejected';
    doc.adminNotes = adminNotes || '';
    return doc.save();
  }

  /** Count pending submissions — used in admin overview badge */
  countPending() {
    return this.model.countDocuments({ status: 'pending' });
  }

  /** Return approved rows for a dataset, tagged with source='community' */
  async findApprovedForDataset(dataset: string): Promise<Record<string, any>[]> {
    const docs = await this.model
      .find({ dataset, status: 'approved' })
      .lean();

    return docs.flatMap((doc) =>
      doc.data.map((row) => ({
        ...row,
        _source: 'community',
        _contributor: doc.submitterName,
        _organization: doc.submitterOrganization,
        _submittedAt: (doc as any).createdAt,
      })),
    );
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: 'pending' }),
      this.model.countDocuments({ status: 'approved' }),
      this.model.countDocuments({ status: 'rejected' }),
    ]);

    const byDataset = await this.model.aggregate([
      { $group: { _id: '$dataset', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return { total, pending, approved, rejected, byDataset };
  }
}
