import { PartialType } from '@nestjs/swagger';
import { CreateKPIDto } from './create-kpi.dto';

export class UpdateKPIDto extends PartialType(CreateKPIDto) {}
