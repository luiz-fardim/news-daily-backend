import { NotFoundException, ConflictException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsService', () => {
  const prismaMock: any = {
    user: { findUnique: jest.fn() },
    plan: { findUnique: jest.fn() },
    subscription: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  };
  const service = new SubscriptionsService(prismaMock as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create should throw NotFoundException if user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.create({ plan_id: 1 } as any, { email: 'x' } as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create should throw NotFoundException if plan not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'x' });
    prismaMock.plan.findUnique.mockResolvedValue(null);
    await expect(service.create({ plan_id: 10 } as any, { email: 'x' } as any)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create should throw ConflictException if active subscription exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'x' });
    prismaMock.plan.findUnique.mockResolvedValue({ id: 1 });
    prismaMock.subscription.findFirst.mockResolvedValue({ id: 1 });
    await expect(service.create({ plan_id: 1 } as any, { email: 'x' } as any)).rejects.toBeInstanceOf(ConflictException);
  });

  it('create should create subscription successfully', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2, email: 'x' });
    prismaMock.plan.findUnique.mockResolvedValue({ id: 2 });
    prismaMock.subscription.findFirst.mockResolvedValue(null);
    prismaMock.subscription.create.mockResolvedValue({ id: 9 });

    const out = await service.create({ plan_id: 2 } as any, { email: 'x' } as any);
    expect(prismaMock.subscription.create).toHaveBeenCalled();
    expect(out).toEqual({ id: 9 });
  });

  it('findAll should return paginated result', async () => {
    prismaMock.subscription.findMany.mockResolvedValue([{ id: 1 }]);
    prismaMock.subscription.count.mockResolvedValue(1);
    const out = await service.findAll(1, 10);
    expect(out.data).toEqual([{ id: 1 }]);
    expect(out.meta.total).toBe(1);
  });
});
