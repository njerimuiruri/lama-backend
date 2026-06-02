import { IsString, IsNotEmpty, IsIn, IsArray, IsOptional } from 'class-validator';

const TYPES = ['form', 'indicator_rows', 'file_upload'] as const;
const DATASETS = ['ndc', 'naps', 'nccap', 'ccap', 'cidps', 'lla', 'gga', 'global', 'community'] as const;

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(TYPES)
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(DATASETS)
  dataset: string;

  @IsArray()
  data: Record<string, any>[];

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
