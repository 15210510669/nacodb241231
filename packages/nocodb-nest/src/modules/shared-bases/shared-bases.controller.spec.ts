import { Test, TestingModule } from '@nestjs/testing';
import { SharedBasesController } from './shared-bases.controller';
import { SharedBasesService } from './shared-bases.service';

describe('SharedBasesController', () => {
  let controller: SharedBasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedBasesController],
      providers: [SharedBasesService],
    }).compile();

    controller = module.get<SharedBasesController>(SharedBasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
