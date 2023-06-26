import { Test, TestingModule } from '@nestjs/testing';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

describe('InstallController', () => {
  let controller: InstallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstallController],
      providers: [InstallService],
    }).compile();

    controller = module.get<InstallController>(InstallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
