import { UsersController } from './users.controller';

describe('UsersController', () => {
  const mockService = { findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const controller = new UsersController(mockService as any);

  it('findAll should call service.findAll', async () => {
    mockService.findAll.mockResolvedValue({ data: [], meta: {} });
    const out = await controller.findAll(1, 10);
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('findOne should call service.findOne', async () => {
    mockService.findOne.mockResolvedValue({ id: 2 });
    const out = await controller.findOne(2, '2');
    expect(mockService.findOne).toHaveBeenCalledWith(2, 2);
  });
});
