import { Test, TestingModule } from '@nestjs/testing';
import { AutoController } from './auto.controller';
import { AutoService } from './auto.service';

describe('AutoController', () => {
  let controller: AutoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoController],
      providers: [AutoService],
    }).compile();

    controller = module.get<AutoController>(AutoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
