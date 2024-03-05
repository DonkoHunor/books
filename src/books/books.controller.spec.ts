import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import {
  BookFinder,
  BooksService,
  UpdateInput,
  yearCheck,
} from './books.service';
import { Book } from './books.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  it('should return BadRequestException when the input is missing arguments', () => {
    mockService.addNewBook = (input: Book) => {
      if (
        input === undefined ||
        input.title === undefined ||
        input.author === undefined ||
        input.publish_year === undefined
      ) {
        throw new BadRequestException();
      } else {
        return input;
      }
    };
    expect(() => controller.addNewBook({ title: 'test' })).toThrow(
      BadRequestException,
    );
  });

  it('should return BadRequestException if the year is wrong', () => {
    mockService.addNewBook = (input: Book) => {
      yearCheck(input.publish_year);
      return input;
    };
    expect(() =>
      controller.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 9999,
      }),
    ).toThrow(BadRequestException);
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

  it('should return that there are no books yet', () => {
    const books: Book[] = [];
    mockService.getAllBooks = () => {
      if (books.length === 0) {
        return 'There are no books yet';
      } else {
        return books;
      }
    };
    expect(controller.getAllBooks()).toEqual('There are no books yet');
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

  it("should return not found if there isn't such book", () => {
    mockService.getBook = (input: BookFinder) => {
      if (input.title === 'testTitle' && input.author === 'testAuthor') {
        throw new NotFoundException();
      } else {
        return { title: 'testTitle', author: 'testAuthor', publish_year: 666 };
      }
    };
    expect(() => controller.getOneBook('testTitle', 'testAuthor')).toThrow(
      NotFoundException,
    );
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

  it('should update only one argument', () => {
    mockService.addNewBook = (newBookInput: Book) => {
      return {
        title: newBookInput.title,
        author: newBookInput.author,
        publish_year: newBookInput.publish_year,
      };
    };
    const book = controller.addNewBook({
      title: 'testTitle',
      author: 'testAuthor',
      publish_year: 1989,
    });
    mockService.updateBook = (input: UpdateInput) => {
      if (input.title !== undefined) {
        book.title = input.title;
      }
      if (input.author !== undefined) {
        book.author = input.author;
      }
      if (input.publish_year !== undefined) {
        book.publish_year = input.publish_year;
      }
      return book;
    };
    controller.updateBook({
      title: 'updatedTitle',
      author: undefined,
      publish_year: undefined,
      prevBook: { ...book },
    });
    expect(book).toEqual({
      title: 'updatedTitle',
      author: 'testAuthor',
      publish_year: 1989,
    });
  });

  it('should return not found if there is no book to update', () => {
    mockService.updateBook = (input: UpdateInput) => {
      if (input.prevBook === undefined) {
        throw new NotFoundException();
      }
      return input;
    };
    expect(
      controller.updateBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2016,
        prevBook: undefined,
      }),
    ).toThrow(NotFoundException);
  });

  it('should call booksService.deleteBook()', () => {
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
