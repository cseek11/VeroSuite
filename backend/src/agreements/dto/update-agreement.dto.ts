import { PartialType } from '@nestjs/swagger';
import { CreateServiceAgreementDto } from './create-agreement.dto';

export class UpdateServiceAgreementDto extends PartialType(CreateServiceAgreementDto) {}