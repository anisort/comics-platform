import { Test, TestingModule } from '@nestjs/testing';
import { ComicsService } from './comics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comic } from '../../entities/comic.entity';
import { GenresService } from '../genres/genres.service';
import { UploadService } from '../upload/upload.service';
import { UsersService } from '../users/users.service';
import { ILike } from 'typeorm';

describe('ComicsService - searchComics', () => {
  let service: ComicsService;

  const mockComics = [
    { id: 1, name: 'Test Comic 1', coverUrl: 'url1' },
    { id: 2, name: 'Another Test Comic', coverUrl: 'url2' },
  ];

  const mockComicRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComicsService,
        { provide: getRepositoryToken(Comic), useValue: mockComicRepository },
        { provide: GenresService, useValue: {} },
        { provide: UploadService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<ComicsService>(ComicsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return array of comics matching search query', async () => {
    mockComicRepository.find.mockResolvedValue(mockComics);

    const result = await service.searchComics('test');

    expect(mockComicRepository.find).toHaveBeenCalledWith({
      where: { name: ILike('%test%') },
      take: 5,
    });

    expect(result).toEqual([
      { id: 1, name: 'Test Comic 1', coverUrl: 'url1' },
      { id: 2, name: 'Another Test Comic', coverUrl: 'url2' },
    ]);
  });
});
