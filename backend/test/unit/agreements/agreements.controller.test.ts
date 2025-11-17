/**
 * Agreements Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AgreementsController } from '../../../src/agreements/agreements.controller';
import { AgreementsService } from '../../../src/agreements/agreements.service';
import { CreateServiceAgreementDto, UpdateServiceAgreementDto } from '../../../src/agreements/dto';
import { ServiceAgreementStatus } from '@prisma/client';

describe('AgreementsController', () => {
  let controller: AgreementsController;
  let agreementsService: AgreementsService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockAgreement = {
    id: 'agreement-123',
    agreement_number: 'AGR-2025-001',
    account_id: 'account-123',
    service_type_id: 'service-type-123',
    start_date: new Date('2025-01-01'),
    end_date: new Date('2025-12-31'),
    status: ServiceAgreementStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgreementsController],
      providers: [
        {
          provide: AgreementsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getAgreementStats: jest.fn(),
            getExpiringAgreements: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AgreementsController>(AgreementsController);
    agreementsService = module.get<AgreementsService>(AgreementsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create agreement successfully', async () => {
      const createAgreementDto: CreateServiceAgreementDto = {
        account_id: 'account-123',
        service_type_id: 'service-type-123',
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        status: ServiceAgreementStatus.ACTIVE,
        frequency: 'monthly',
        price: 100.0,
      };

      jest.spyOn(agreementsService, 'create').mockResolvedValue(mockAgreement as any);

      const result = await controller.create(createAgreementDto, { user: mockUser } as any);

      expect(result).toEqual(mockAgreement);
      expect(agreementsService.create).toHaveBeenCalledWith(
        createAgreementDto,
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated agreements', async () => {
      const mockResponse = {
        data: [mockAgreement],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      jest.spyOn(agreementsService, 'findAll').mockResolvedValue(mockResponse as any);

      const result = await controller.findAll(
        { user: mockUser } as any,
        '1',
        '10',
        ServiceAgreementStatus.ACTIVE
      );

      expect(result).toEqual(mockResponse);
      expect(agreementsService.findAll).toHaveBeenCalledWith(
        mockUser.tenantId,
        '1',
        '10',
        ServiceAgreementStatus.ACTIVE
      );
    });

    it('should use default pagination when not provided', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      jest.spyOn(agreementsService, 'findAll').mockResolvedValue(mockResponse as any);

      await controller.findAll({ user: mockUser } as any, undefined, undefined, undefined);

      expect(agreementsService.findAll).toHaveBeenCalledWith(
        mockUser.tenantId,
        undefined,
        undefined,
        undefined
      );
    });
  });

  describe('findOne', () => {
    it('should return agreement by ID', async () => {
      jest.spyOn(agreementsService, 'findOne').mockResolvedValue(mockAgreement as any);

      const result = await controller.findOne('agreement-123', { user: mockUser } as any);

      expect(result).toEqual(mockAgreement);
      expect(agreementsService.findOne).toHaveBeenCalledWith('agreement-123', mockUser.tenantId);
    });
  });

  describe('update', () => {
    it('should update agreement successfully', async () => {
      const updateAgreementDto: UpdateServiceAgreementDto = {
        status: ServiceAgreementStatus.INACTIVE,
        price: 150.0,
      };

      const updatedAgreement = { ...mockAgreement, ...updateAgreementDto };
      jest.spyOn(agreementsService, 'update').mockResolvedValue(updatedAgreement as any);

      const result = await controller.update(
        'agreement-123',
        updateAgreementDto,
        { user: mockUser } as any
      );

      expect(result).toEqual(updatedAgreement);
      expect(agreementsService.update).toHaveBeenCalledWith(
        'agreement-123',
        updateAgreementDto,
        mockUser.tenantId,
        mockUser.userId
      );
    });
  });

  describe('remove', () => {
    it('should delete agreement successfully', async () => {
      jest.spyOn(agreementsService, 'remove').mockResolvedValue(mockAgreement as any);

      await controller.remove('agreement-123', { user: mockUser } as any);

      expect(agreementsService.remove).toHaveBeenCalledWith('agreement-123', mockUser.tenantId);
    });
  });

  describe('getStats', () => {
    it('should return agreement statistics', async () => {
      const mockStats = {
        totalAgreements: 10,
        activeAgreements: 5,
        expiredAgreements: 2,
        pendingAgreements: 3,
        totalValue: 1000,
      };

      jest.spyOn(agreementsService, 'getAgreementStats').mockResolvedValue(mockStats as any);

      const result = await controller.getStats({ user: mockUser } as any);

      expect(result).toEqual(mockStats);
      expect(agreementsService.getAgreementStats).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('getExpiring', () => {
    it('should return expiring agreements with custom days', async () => {
      jest.spyOn(agreementsService, 'getExpiringAgreements').mockResolvedValue([mockAgreement] as any);

      const result = await controller.getExpiring({ user: mockUser } as any, 60);

      expect(result).toEqual([mockAgreement]);
      expect(agreementsService.getExpiringAgreements).toHaveBeenCalledWith(mockUser.tenantId, 60);
    });

    it('should use default 30 days when not provided', async () => {
      jest.spyOn(agreementsService, 'getExpiringAgreements').mockResolvedValue([]);

      await controller.getExpiring({ user: mockUser } as any, undefined);

      expect(agreementsService.getExpiringAgreements).toHaveBeenCalledWith(mockUser.tenantId, 30);
    });
  });
});

