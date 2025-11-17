/**
 * Prisma Mock Factory
 * Creates properly typed mocks for Prisma/Database services in tests
 */

export const createMockPrismaClient = () => {
  const mockFindFirst = jest.fn();
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockDeleteMany = jest.fn();
  const mockCount = jest.fn();
  const mockUpsert = jest.fn();

  const mockDelegate = {
    findFirst: mockFindFirst,
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    count: mockCount,
    upsert: mockUpsert,
  };

  return {
    user: { ...mockDelegate },
    tenant: { ...mockDelegate },
    account: { ...mockDelegate },
    customerProfile: { ...mockDelegate },
    workOrder: { ...mockDelegate },
    job: { ...mockDelegate },
    invoice: { ...mockDelegate },
    payment: { ...mockDelegate },
    dashboardLayout: { ...mockDelegate },
    dashboardRegion: { ...mockDelegate },
    dashboardLayoutVersion: { ...mockDelegate },
    dashboardRegionAcl: { ...mockDelegate },
    dashboardWidgetRegistry: { ...mockDelegate },
    dashboardMigrationLog: { ...mockDelegate },
    dashboardRegionPresence: { ...mockDelegate },
    dashboardLayoutAudit: { ...mockDelegate },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn((callback) => callback(mockDelegate)),
  };
};

export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;


