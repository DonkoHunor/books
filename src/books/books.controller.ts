import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { BookFinder, BooksService, UpdateInput } from './books.service';
import { Book } from './books.model';

@Controller()
export class BooksController {
  constructor(private readonly service: BooksService) {}
  @Get('allBooks')
  getAllBooks() {
    return this.service.getAllBooks();
  }

  @Get('book')
  getOneBook(@Query() titleInput: string, @Query() authorInput: string) {
    return this.service.getBook({ title: titleInput, author: authorInput });
  }

  @Post('newBook')
  addNewBook(@Body() newBookInput: Book) {
    return this.service.addNewBook(newBookInput);
  }

  @Delete('deleteBook')
  deleteBook(@Body() deleteBookInput: BookFinder) {
    return this.service.deleteBook(deleteBookInput);
  }

  @Post('updateBook')
  updateBook(@Body() updateBookInput: UpdateInput) {
    return this.service.updateBook(updateBookInput);
  }
}
