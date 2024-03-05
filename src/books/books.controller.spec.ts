import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BookFinder, BooksService, UpdateInput } from './books.service';
import { Book } from './books.model';

describe('BooksController', () => {
  let controller: BooksController;
  let mockService: BooksService;

  beforeEach(async () => {
    mockService = {} as BooksService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should return the created book', () => {
    mockService.addNewBook = (newBookInput: Book) => {
      return {
        title: newBookInput.title,
        author: newBookInput.author,
        publish_year: newBookInput.publish_year,
      };
    };
    const newBook = controller.addNewBook({
      title: 'testTitle',
      author: 'testAuthor',
      publish_year: 2011,
    });
    expect(newBook).toEqual({
      title: 'testTitle',
      author: 'testAuthor',
      publish_year: 2011,
    });
  });

  it('should return all books', () => {
    mockService.getAllBooks = () => {
      return [
        {
          title: 'testTitle',
          author: 'testAuthor',
          publish_year: 2011,
        },
        {
          title: 'testTitle2',
          author: 'testAuthor2',
          publish_year: 2012,
        },
      ];
    };

    expect(controller.getAllBooks()).toEqual([
      {
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2011,
      },
      {
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2012,
      },
    ]);
  });

  it('should return one exact book', () => {
    mockService.getBook = (input: BookFinder) => {
      return { ...input, publish_year: 2014 };
    };
    expect(controller.getOneBook('testTitle', 'testAuthor')).toEqual({
      title: 'testTitle',
      author: 'testAuthor',
      publish_year: 2014,
    });
  });

  it('should update the target book', () => {
    mockService.addNewBook = (newBookInput: Book) => {
      return {
        title: newBookInput.title,
        author: newBookInput.author,
        publish_year: newBookInput.publish_year,
      };
    };
    mockService.updateBook = (input: UpdateInput) => {
      return {
        title: input.title,
        author: input.author,
        publish_year: input.publish_year,
      };
    };
    controller.addNewBook({
      title: 'testTitle',
      author: 'testAuthor',
      publish_year: 2014,
    });
    const updated = controller.updateBook({
      title: 'updatedTitle',
      author: 'updatedAuthor',
      publish_year: 2024,
      prevBook: {
        title: 'testTitle',
        author: 'testAuthor',
      },
    });

    expect(updated).toEqual({
      title: 'updatedTitle',
      author: 'updatedAuthor',
      publish_year: 2024,
    });
  });

  it('should call booksServcie.deleteBook()', () => {
    mockService.deleteBook = jest.fn();
    controller.deleteBook({
      title: 'testDeleteTitle',
      author: 'testDeleteAuthor',
    });
    expect(mockService.deleteBook).toBeCalledWith({
      title: 'testDeleteTitle',
      author: 'testDeleteAuthor',
    });
  });
});
