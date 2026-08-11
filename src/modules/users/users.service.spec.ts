import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const prismaMock: any = {
    user: { findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() }
  };
  const service = new UsersService(prismaMock as any);

  beforeEach(() => jest.clearAllMocks());

  it('findAll should return paginated users', async () => {
    prismaMock.user.findMany.mockResolvedValue([{ id: 1 }]);
    prismaMock.user.count.mockResolvedValue(1);
    const out = await service.findAll(1, 10);
    expect(out.data).toEqual([{ id: 1 }]);
    expect(out.meta.total).toBe(1);
  });

  it('findOne should throw NotFoundException when not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(5, 5)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findOne should throw ForbiddenException when wrong user', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2 });
    await expect(service.findOne(2, 3)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('update should update user when authorized', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 4 });
    prismaMock.user.update.mockResolvedValue({ id: 4, name: 'ok' });
    const out = await service.update(4, { name: 'ok' } as any, 4);
    expect(prismaMock.user.update).toHaveBeenCalled();
    expect(out).toEqual({ id: 4, name: 'ok' });
  });

  it('remove should delete when authorized', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 6 });
    prismaMock.user.delete.mockResolvedValue({});
    const out = await service.remove(6, 6);
    expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 6 } });
    expect(out).toEqual({ message: `User with ID 6 has been deleted` });
  });
});
