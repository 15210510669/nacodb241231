import { Test, TestingModule } from '@nestjs/testing';
import { PublicDatasExportController } from './public-datas-export.controller';
import { PublicDatasExportService } from './public-datas-export.service';

describe('PublicDatasExportController', () => {
  let controller: PublicDatasExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicDatasExportController],
      providers: [PublicDatasExportService],
    }).compile();

    controller = module.get<PublicDatasExportController>(PublicDatasExportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
