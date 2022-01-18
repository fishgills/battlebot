import { Test, TestingModule } from '@nestjs/testing';
import { ConnectproxyController } from './connectproxy.controller';

describe('ConnectproxyController', () => {
  let controller: ConnectproxyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectproxyController],
    }).compile();

    controller = module.get<ConnectproxyController>(ConnectproxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
