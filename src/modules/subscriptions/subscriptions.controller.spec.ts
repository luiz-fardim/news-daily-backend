import { SubscriptionsController } from './subscriptions.controller';

describe('SubscriptionsController', () => {
  const mockService = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const controller = new SubscriptionsController(mockService as any);

  it('create should call service.create with req.user', async () => {
    mockService.create.mockResolvedValue({ id: 1 });
    const req: any = { user: { id: 1, email: 'x' } };
    const out = await controller.create({ plan_id: 1 } as any, req);
    expect(mockService.create).toHaveBeenCalledWith({ plan_id: 1 }, req.user);
    expect(out).toEqual({ id: 1 });
  });

  it('findAll should call service.findAll with page and limit', async () => {
    mockService.findAll.mockResolvedValue({ data: [], meta: {} });
    const out = await controller.findAll(1, 10);
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10);
  });
});
