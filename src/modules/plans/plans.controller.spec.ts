import { PlansController } from './plans.controller';

describe('PlansController', () => {
  const mockService = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const controller = new PlansController(mockService as any);

  it('create should call service.create', async () => {
    mockService.create.mockResolvedValue({ id: 1 });
    const out = await controller.create({ name: 'x' } as any);
    expect(mockService.create).toHaveBeenCalled();
    expect(out).toEqual({ id: 1 });
  });

  it('findAll should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue([]);
    const out = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(out).toEqual([]);
  });

  it('findOne should call service.findOne', async () => {
    mockService.findOne.mockResolvedValue({ id: 2 });
    const out = await controller.findOne('2');
    expect(mockService.findOne).toHaveBeenCalledWith(2);
    expect(out).toEqual({ id: 2 });
  });
});
