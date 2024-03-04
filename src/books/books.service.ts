import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './books.model';

export type BookFinder = Omit<Book, 'publish_year'>;

export interface UpdateInput extends Book {
  prevBook: BookFinder;
}

@Injectable()
export class BooksService {
  private books: Book[] = [];

  getAllBooks() {
    if (this.books.length === 0) {
      return 'There are no books yet';
    }
    return this.books;
  }

  getBook(getOneBookInput: BookFinder) {
    if (
      getOneBookInput.title === undefined ||
      getOneBookInput.author === undefined
    ) {
      throw new BadRequestException();
    }
    for (const book of this.books) {
      if (
        book.title === getOneBookInput.title &&
        book.author === getOneBookInput.author
      ) {
        return book;
      }
    }
    throw new NotFoundException();
  }

  addNewBook(newBookInput: Book) {
    if (
      newBookInput.title === undefined ||
      newBookInput.author === undefined ||
      newBookInput.publish_year === null
    ) {
      throw new BadRequestException();
    }
    this.books.push({ ...newBookInput });
    return newBookInput;
  }

  deleteBook(input: BookFinder) {
    let NotFound = true;
    this.books.forEach((book, index) => {
      if (book.title === input.title && book.author === input.author) {
        this.books.splice(index, 1);
        NotFound = false;
      }
    });
    if (NotFound) {
      throw new NotFoundException();
    }
  }

  updateBook(input: UpdateInput) {
    for (const book of this.books) {
      if (
        book.title === input.prevBook.title &&
        book.author === input.prevBook.author
      ) {
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
      }
    }
    throw new NotFoundException();
  }
}
