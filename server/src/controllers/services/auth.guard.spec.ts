import { GqlAuthGuard } from '../services/auth.guard';

describe('UserGuard', () => {
  it('should be defined', () => {
    expect(new GqlAuthGuard()).toBeDefined();
  });
});
