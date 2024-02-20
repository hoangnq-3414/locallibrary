import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { Author } from '../entities/Author';
import { Genre } from '../entities/Genre';
import { BookInstance } from '../entities/BookInstance';

export const index = async (req: Request, res: Response) => {
  try {
    const bookRepository = AppDataSource.getRepository(Book);
    const authorRepository = AppDataSource.getRepository(Author);
    const genreRepository = AppDataSource.getRepository(Genre);
    const bookInstanceRepository = AppDataSource.getRepository(BookInstance);

    // Get details of books, book instances, authors, and genre counts (in parallel)
    const [
      numBooks,
      numBookInstances,
      numAvailableBookInstances,
      numAuthors,
      numGenres,
    ] = await Promise.all([
      bookRepository.count(),
      bookInstanceRepository.count(),
      bookInstanceRepository.count({ where: { status: 'Available' } }),
      authorRepository.count(),
      genreRepository.count(),
    ]);

    res.render('index', {
      title: 'Local Library Home',
      book_count: numBooks,
      book_instance_count: numBookInstances,
      book_instance_available_count: numAvailableBookInstances,
      author_count: numAuthors,
      genre_count: numGenres,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

// Display list of all books.
exports.book_list = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book list");
});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

// Handle book create on POST.
exports.book_create_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

// Handle book update on POST.
exports.book_update_post = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
