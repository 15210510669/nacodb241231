import { Test, TestingModule } from '@nestjs/testing';
import { DataAliasNestedService } from './data-alias-nested.service';

describe('DataAliasNestedService', () => {
  let service: DataAliasNestedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataAliasNestedService],
    }).compile();

    service = module.get<DataAliasNestedService>(DataAliasNestedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
