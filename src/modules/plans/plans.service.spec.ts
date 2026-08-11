import { PlansService } from './plans.service';

describe('PlansService', () => {
  const prismaMock: any = {
    plan: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  };
  const service = new PlansService(prismaMock as any);

  it('create should call prisma.create and return plan', async () => {
    prismaMock.plan.create.mockResolvedValue({ id: 1, name: 'Basic' });
    const out = await service.create({ name: 'Basic', price: 10, billing_interval: 'monthly' } as any);
    expect(prismaMock.plan.create).toHaveBeenCalled();
    expect(out).toEqual({ id: 1, name: 'Basic' });
  });

  it('findAll should call prisma.findMany', async () => {
    prismaMock.plan.findMany.mockResolvedValue([{ id: 1 }]);
    const out = await service.findAll();
    expect(prismaMock.plan.findMany).toHaveBeenCalled();
    expect(out).toEqual([{ id: 1 }]);
  });

  it('findOne should call prisma.findUnique', async () => {
    prismaMock.plan.findUnique.mockResolvedValue({ id: 2 });
    const out = await service.findOne(2);
    expect(prismaMock.plan.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(out).toEqual({ id: 2 });
  });

  it('update should call prisma.update', async () => {
    prismaMock.plan.update.mockResolvedValue({ id: 3, name: 'Pro' });
    const out = await service.update(3, { name: 'Pro', price: 20, billing_interval: 'monthly' } as any);
    expect(prismaMock.plan.update).toHaveBeenCalled();
    expect(out).toEqual({ id: 3, name: 'Pro' });
  });

  it('remove should delete and return message', async () => {
    prismaMock.plan.delete.mockResolvedValue({});
    const out = await service.remove(5);
    expect(prismaMock.plan.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(out).toEqual({ message: `Plan with id 5 has been deleted.` });
  });
});
