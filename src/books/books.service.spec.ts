import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './books.model';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('should create one book', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      expect(service.getAllBooks().length).toEqual(1);
    });
  });

  describe('read', () => {
    it('should return a list of books after created', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      expect(service.getAllBooks()).toEqual([
        {
          title: 'testTitle',
          author: 'testAuthor',
          publish_year: 2015,
        },
        {
          title: 'testTitle2',
          author: 'testAuthor2',
          publish_year: 2002,
        },
      ]);
    });

    it('should return that there are no books yet', () => {
      expect(service.getAllBooks()).toEqual('There are no books yet');
    });

    it('should return one book after created', () => {
      const book = service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      expect(service.getBook(book)).toEqual(book);
    });

    it('should return not found if there is no such book', () => {
      expect(() => {
        service.getBook({ title: 'testTitle', author: 'testAuthor' });
      }).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update the target book with every new value', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      const bookToBeUpdated = service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      service.addNewBook({
        title: 'testTitle3',
        author: 'testAuthor3',
        publish_year: 1992,
      });
      const update: Book = {
        title: 'updatedTitle',
        author: 'updatedAuthor',
        publish_year: 2022,
      };
      service.updateBook({
        prevBook: {
          title: bookToBeUpdated.title,
          author: bookToBeUpdated.author,
        },
        ...update,
      });
      expect(service.getBook(update)).toEqual({
        title: 'updatedTitle',
        author: 'updatedAuthor',
        publish_year: 2022,
      });
    });

    it('should update the target book with the new title only', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      const bookToBeUpdated = service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      service.addNewBook({
        title: 'testTitle3',
        author: 'testAuthor3',
        publish_year: 1992,
      });
      const update: Book = {
        title: 'updatedTitle',
      };
      const newBook = service.updateBook({
        prevBook: {
          title: bookToBeUpdated.title,
          author: bookToBeUpdated.author,
        },
        ...update,
      });
      expect(service.getBook(newBook)).toEqual({
        title: 'updatedTitle',
        author: 'testAuthor2',
        publish_year: 2002,
      });
    });

    it('should throw not found if there is no such book', () => {
      const updateData: Book = {
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      };
      expect(() => {
        service.updateBook({
          prevBook: { title: 'testInput', author: 'testInput' },
          ...updateData,
        });
      }).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the target book', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      const bookToBeDeleted = service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      service.deleteBook({
        title: bookToBeDeleted.title,
        author: bookToBeDeleted.author,
      });
      expect(service.getAllBooks()).toEqual([
        {
          title: 'testTitle',
          author: 'testAuthor',
          publish_year: 2015,
        },
      ]);
    });

    it('should delete only one book', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      const bookToBeDeleted = service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      service.deleteBook({
        title: bookToBeDeleted.title,
        author: bookToBeDeleted.author,
      });
      expect(service.getAllBooks().length).toEqual(1);
    });

    it('should throw not found if there is no such book', () => {
      service.addNewBook({
        title: 'testTitle',
        author: 'testAuthor',
        publish_year: 2015,
      });
      service.addNewBook({
        title: 'testTitle2',
        author: 'testAuthor2',
        publish_year: 2002,
      });
      expect(() => {
        service.deleteBook({ title: 'testTitle3', author: 'testAuthor3' });
      }).toThrow(NotFoundException);
    });
  });
});
