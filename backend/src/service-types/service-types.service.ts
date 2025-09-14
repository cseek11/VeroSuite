import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';

@Injectable()
export class ServiceTypesService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createServiceTypeDto: CreateServiceTypeDto, tenantId: string) {
    const serviceType = await this.prisma.serviceType.create({
      data: {
        ...createServiceTypeDto,
        tenant_id: tenantId,
      },
    });

    return serviceType;
  }

  async findAll(tenantId: string, page?: string, limit?: string, isActive?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 100;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      tenant_id: tenantId,
    };

    if (isActive !== undefined) {
      where.is_active = isActive === 'true';
    }

    const [serviceTypes, total] = await Promise.all([
      this.prisma.serviceType.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          service_name: 'asc',
        },
      }),
      this.prisma.serviceType.count({ where }),
    ]);

    return {
      serviceTypes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const serviceType = await this.prisma.serviceType.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
    });

    if (!serviceType) {
      throw new NotFoundException(`Service type with ID ${id} not found`);
    }

    return serviceType;
  }

  async update(id: string, updateServiceTypeDto: UpdateServiceTypeDto, tenantId: string) {
    await this.findOne(id, tenantId);

    const serviceType = await this.prisma.serviceType.update({
      where: { id },
      data: updateServiceTypeDto,
    });

    return serviceType;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await this.prisma.serviceType.delete({
      where: { id },
    });

    return { message: 'Service type deleted successfully' };
  }
}
