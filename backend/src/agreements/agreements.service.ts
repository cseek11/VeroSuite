import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { CreateServiceAgreementDto, UpdateServiceAgreementDto } from './dto';
import { ServiceAgreementStatus } from '@prisma/client';

@Injectable()
export class AgreementsService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createAgreementDto: CreateServiceAgreementDto, tenantId: string, userId: string) {
    try {
      // Verify account exists and belongs to tenant
      const account = await this.prisma.account.findFirst({
        where: {
          id: createAgreementDto.account_id,
          tenant_id: tenantId,
        },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // Verify service type exists and belongs to tenant
      const serviceType = await this.prisma.serviceType.findFirst({
        where: {
          id: createAgreementDto.service_type_id,
          tenant_id: tenantId,
        },
      });

      if (!serviceType) {
        throw new NotFoundException('Service type not found');
      }

      // Check if agreement number already exists for this tenant
      const existingAgreement = await this.prisma.serviceAgreement.findFirst({
        where: {
          agreement_number: createAgreementDto.agreement_number,
          tenant_id: tenantId,
        },
      });

      if (existingAgreement) {
        throw new BadRequestException('Agreement number already exists');
      }

      const agreement = await this.prisma.serviceAgreement.create({
        data: {
          ...createAgreementDto,
          tenant_id: tenantId,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date(),
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service_types: {
            select: {
              id: true,
              service_name: true,
              description: true,
            },
          },
        },
      });

      return agreement;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create agreement');
    }
  }

  async findAll(tenantId: string, page?: string, limit?: string, status?: ServiceAgreementStatus) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;
    
    const where: any = {
      tenant_id: tenantId,
    };

    if (status) {
      where.status = status;
    }

    const [agreements, total] = await Promise.all([
      this.prisma.serviceAgreement.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service_types: {
            select: {
              id: true,
              service_name: true,
              description: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.serviceAgreement.count({ where }),
    ]);

    return {
      agreements,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string, tenantId: string) {
    const agreement = await this.prisma.serviceAgreement.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zip_code: true,
          },
        },
        service_types: {
          select: {
            id: true,
            service_name: true,
            description: true,
            base_price: true,
          },
        },
        Invoice: {
          select: {
            id: true,
            invoice_number: true,
            status: true,
            total_amount: true,
            due_date: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!agreement) {
      throw new NotFoundException('Agreement not found');
    }

    return agreement;
  }

  async update(id: string, updateAgreementDto: UpdateServiceAgreementDto, tenantId: string, userId: string) {
    try {
      // Verify agreement exists and belongs to tenant
      const existingAgreement = await this.prisma.serviceAgreement.findFirst({
        where: {
          id,
          tenant_id: tenantId,
        },
      });

      if (!existingAgreement) {
        throw new NotFoundException('Agreement not found');
      }

      // If updating account_id, verify account exists
      if (updateAgreementDto.account_id) {
        const account = await this.prisma.account.findFirst({
          where: {
            id: updateAgreementDto.account_id,
            tenant_id: tenantId,
          },
        });

        if (!account) {
          throw new NotFoundException('Account not found');
        }
      }

      // If updating service_type_id, verify service type exists
      if (updateAgreementDto.service_type_id) {
        const serviceType = await this.prisma.serviceType.findFirst({
          where: {
            id: updateAgreementDto.service_type_id,
            tenant_id: tenantId,
          },
        });

        if (!serviceType) {
          throw new NotFoundException('Service type not found');
        }
      }

      // If updating agreement_number, check for duplicates
      if (updateAgreementDto.agreement_number) {
        const duplicateAgreement = await this.prisma.serviceAgreement.findFirst({
          where: {
            agreement_number: updateAgreementDto.agreement_number,
            tenant_id: tenantId,
            id: { not: id },
          },
        });

        if (duplicateAgreement) {
          throw new BadRequestException('Agreement number already exists');
        }
      }

      const agreement = await this.prisma.serviceAgreement.update({
        where: { id },
        data: {
          ...updateAgreementDto,
          updated_by: userId,
          updated_at: new Date(),
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service_types: {
            select: {
              id: true,
              service_name: true,
              description: true,
            },
          },
        },
      });

      return agreement;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update agreement');
    }
  }

  async remove(id: string, tenantId: string) {
    try {
      // Verify agreement exists and belongs to tenant
      const agreement = await this.prisma.serviceAgreement.findFirst({
        where: {
          id,
          tenant_id: tenantId,
        },
      });

      if (!agreement) {
        throw new NotFoundException('Agreement not found');
      }

      // Check if agreement has associated invoices
      const invoiceCount = await this.prisma.invoice.count({
        where: {
          service_agreement_id: id,
        },
      });

      if (invoiceCount > 0) {
        throw new BadRequestException('Cannot delete agreement with associated invoices');
      }

      await this.prisma.serviceAgreement.delete({
        where: { id },
      });

      return { message: 'Agreement deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete agreement');
    }
  }

  async getAgreementStats(tenantId: string) {
    const [
      totalAgreements,
      activeAgreements,
      expiredAgreements,
      pendingAgreements,
      totalValue,
    ] = await Promise.all([
      this.prisma.serviceAgreement.count({
        where: { tenant_id: tenantId },
      }),
      this.prisma.serviceAgreement.count({
        where: { tenant_id: tenantId, status: ServiceAgreementStatus.active },
      }),
      this.prisma.serviceAgreement.count({
        where: { tenant_id: tenantId, status: ServiceAgreementStatus.expired },
      }),
      this.prisma.serviceAgreement.count({
        where: { tenant_id: tenantId, status: ServiceAgreementStatus.inactive },
      }),
      this.prisma.serviceAgreement.aggregate({
        where: { tenant_id: tenantId },
        _sum: { pricing: true },
      }),
    ]);

    return {
      totalAgreements,
      activeAgreements,
      expiredAgreements,
      pendingAgreements,
      totalValue: totalValue._sum.pricing || 0,
    };
  }

  async getExpiringAgreements(tenantId: string, days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const agreements = await this.prisma.serviceAgreement.findMany({
      where: {
        tenant_id: tenantId,
        status: ServiceAgreementStatus.active,
        end_date: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service_types: {
          select: {
            id: true,
            service_name: true,
          },
        },
      },
      orderBy: {
        end_date: 'asc',
      },
    });

    return agreements;
  }
}
