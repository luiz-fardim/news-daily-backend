import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const mockService = { create: jest.fn(), compare: jest.fn() };
  const controller = new AuthController(mockService as any);

  it('signup should call authService.create and return value', async () => {
    mockService.create.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const out = await controller.signup({ email: 'a@b.com', password: '123' } as any);
    expect(mockService.create).toHaveBeenCalled();
    expect(out).toEqual({ id: 1, email: 'a@b.com' });
  });

  it('signin should call authService.compare and return tokens', async () => {
    mockService.compare.mockResolvedValue({ accessToken: 'a', refreshToken: 'b' });
    const out = await controller.signin({ email: 'a@b.com', password: '123' } as any);
    expect(mockService.compare).toHaveBeenCalled();
    expect(out).toEqual({ accessToken: 'a', refreshToken: 'b' });
  });
});
