/**
 * Agreements Service Unit Tests
 * Tests for agreement CRUD operations, stats, and expiring agreements
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AgreementsService } from '../../../src/agreements/agreements.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { CreateServiceAgreementDto, UpdateServiceAgreementDto } from '../../../src/agreements/dto';
import { ServiceAgreementStatus } from '@prisma/client';

describe('AgreementsService', () => {
  let service: AgreementsService;
  let databaseService: DatabaseService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockAgreementId = 'agreement-123';
  const mockAccountId = 'account-123';
  const mockServiceTypeId = 'service-type-123';

  const mockAccount = {
    id: mockAccountId,
    name: 'Test Account',
    email: 'test@example.com',
    phone: '123-456-7890',
    tenant_id: mockTenantId,
  };

  const mockServiceType = {
    id: mockServiceTypeId,
    service_name: 'Pest Control',
    description: 'Monthly pest control service',
    tenant_id: mockTenantId,
  };

  const mockAgreement = {
    id: mockAgreementId,
    agreement_number: 'AGR-2025-001',
    account_id: mockAccountId,
    service_type_id: mockServiceTypeId,
    start_date: new Date('2025-01-01'),
    end_date: new Date('2025-12-31'),
    status: ServiceAgreementStatus.ACTIVE,
    tenant_id: mockTenantId,
    created_by: mockUserId,
    updated_by: mockUserId,
    account: mockAccount,
    service_types: mockServiceType,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgreementsService,
        {
          provide: DatabaseService,
          useValue: {
            account: {
              findFirst: jest.fn(),
            },
            serviceType: {
              findFirst: jest.fn(),
            },
            serviceAgreement: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
              aggregate: jest.fn(),
            },
            invoice: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AgreementsService>(AgreementsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createAgreementDto: CreateServiceAgreementDto = {
      account_id: mockAccountId,
      service_type_id: mockServiceTypeId,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      status: ServiceAgreementStatus.ACTIVE,
      frequency: 'monthly',
      price: 100.0,
    };

    it('should create agreement successfully', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(databaseService.serviceType, 'findFirst').mockResolvedValue(mockServiceType as any);
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.serviceAgreement, 'create').mockResolvedValue(mockAgreement as any);

      const result = await service.create(createAgreementDto, mockTenantId, mockUserId);

      expect(result).toEqual(mockAgreement);
      expect(databaseService.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAccountId,
          tenant_id: mockTenantId,
        },
      });
      expect(databaseService.serviceType.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockServiceTypeId,
          tenant_id: mockTenantId,
        },
      });
      expect(databaseService.serviceAgreement.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when account not found', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(null);

      await expect(service.create(createAgreementDto, mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException when service type not found', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(databaseService.serviceType, 'findFirst').mockResolvedValue(null);

      await expect(service.create(createAgreementDto, mockTenantId, mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should generate agreement number when not provided', async () => {
      const dtoWithoutNumber = { ...createAgreementDto };
      delete (dtoWithoutNumber as any).agreement_number;

      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(databaseService.serviceType, 'findFirst').mockResolvedValue(mockServiceType as any);
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.serviceAgreement, 'count').mockResolvedValue(0);
      jest.spyOn(databaseService.serviceAgreement, 'create').mockResolvedValue(mockAgreement as any);

      await service.create(dtoWithoutNumber, mockTenantId, mockUserId);

      expect(databaseService.serviceAgreement.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            agreement_number: expect.any(String),
          }),
        })
      );
    });

    it('should throw BadRequestException when agreement number already exists', async () => {
      jest.spyOn(databaseService.account, 'findFirst').mockResolvedValue(mockAccount as any);
      jest.spyOn(databaseService.serviceType, 'findFirst').mockResolvedValue(mockServiceType as any);
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue({
        id: 'existing-agreement',
      } as any);

      await expect(service.create(createAgreementDto, mockTenantId, mockUserId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated agreements', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findMany').mockResolvedValue([mockAgreement] as any);
      jest.spyOn(databaseService.serviceAgreement, 'count').mockResolvedValue(1);

      const result = await service.findAll(mockTenantId, '1', '10');

      expect(result).toBeDefined();
      expect(result.data).toEqual([mockAgreement]);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should filter by status', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findMany').mockResolvedValue([mockAgreement] as any);
      jest.spyOn(databaseService.serviceAgreement, 'count').mockResolvedValue(1);

      await service.findAll(mockTenantId, '1', '10', ServiceAgreementStatus.ACTIVE);

      expect(databaseService.serviceAgreement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ServiceAgreementStatus.ACTIVE,
          }),
        })
      );
    });

    it('should use default pagination when not provided', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.serviceAgreement, 'count').mockResolvedValue(0);

      const result = await service.findAll(mockTenantId);

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return agreement by ID', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(mockAgreement as any);

      const result = await service.findOne(mockAgreementId, mockTenantId);

      expect(result).toEqual(mockAgreement);
      expect(databaseService.serviceAgreement.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAgreementId,
          tenant_id: mockTenantId,
        },
        include: {
          account: true,
          service_types: true,
        },
      });
    });

    it('should throw NotFoundException when agreement not found', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne('non-existent', mockTenantId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateAgreementDto: UpdateServiceAgreementDto = {
      status: ServiceAgreementStatus.INACTIVE,
      price: 150.0,
    };

    it('should update agreement successfully', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(mockAgreement as any);
      jest
        .spyOn(databaseService.serviceAgreement, 'update')
        .mockResolvedValue({ ...mockAgreement, ...updateAgreementDto } as any);

      const result = await service.update(mockAgreementId, updateAgreementDto, mockTenantId, mockUserId);

      expect(result).toBeDefined();
      expect(result.status).toBe(ServiceAgreementStatus.INACTIVE);
      expect(databaseService.serviceAgreement.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when agreement not found', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(null);

      await expect(
        service.update('non-existent', updateAgreementDto, mockTenantId, mockUserId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle date conversion for start_date', async () => {
      const updateWithDate: UpdateServiceAgreementDto = {
        start_date: '2025-02-01',
      };

      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(mockAgreement as any);
      jest.spyOn(databaseService.serviceAgreement, 'update').mockResolvedValue(mockAgreement as any);

      await service.update(mockAgreementId, updateWithDate, mockTenantId, mockUserId);

      expect(databaseService.serviceAgreement.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            start_date: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('remove', () => {
    it('should delete agreement successfully', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(mockAgreement as any);
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.serviceAgreement, 'delete').mockResolvedValue(mockAgreement as any);

      await service.remove(mockAgreementId, mockTenantId);

      expect(databaseService.serviceAgreement.delete).toHaveBeenCalledWith({
        where: { id: mockAgreementId },
      });
    });

    it('should throw NotFoundException when agreement not found', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(null);

      await expect(service.remove('non-existent', mockTenantId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when agreement has invoices', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findFirst').mockResolvedValue(mockAgreement as any);
      jest.spyOn(databaseService.invoice, 'findFirst').mockResolvedValue({
        id: 'invoice-123',
      } as any);

      await expect(service.remove(mockAgreementId, mockTenantId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAgreementStats', () => {
    it('should return agreement statistics', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'count')
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5) // active
        .mockResolvedValueOnce(2) // expired
        .mockResolvedValueOnce(3); // inactive
      jest.spyOn(databaseService.serviceAgreement, 'aggregate').mockResolvedValue({
        _sum: { pricing: 1000 },
      } as any);

      const result = await service.getAgreementStats(mockTenantId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalAgreements');
      expect(result).toHaveProperty('activeAgreements');
      expect(result).toHaveProperty('expiredAgreements');
      expect(result).toHaveProperty('pendingAgreements');
      expect(result).toHaveProperty('totalValue');
    });
  });

  describe('getExpiringAgreements', () => {
    it('should return agreements expiring within specified days', async () => {
      const expiringAgreement = {
        ...mockAgreement,
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      };

      jest.spyOn(databaseService.serviceAgreement, 'findMany').mockResolvedValue([expiringAgreement] as any);

      const result = await service.getExpiringAgreements(mockTenantId, 30);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(databaseService.serviceAgreement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: ServiceAgreementStatus.ACTIVE,
          }),
        })
      );
    });

    it('should use default 30 days when not specified', async () => {
      jest.spyOn(databaseService.serviceAgreement, 'findMany').mockResolvedValue([]);

      await service.getExpiringAgreements(mockTenantId);

      expect(databaseService.serviceAgreement.findMany).toHaveBeenCalled();
    });
  });
});

