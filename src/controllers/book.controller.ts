import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { Author } from '../entities/Author';
import { Genre } from '../entities/Genre';
import { BookInstance } from '../entities/BookInstance';
import { BookInstanceStatus } from '../untils/constants';
import { BookGenre } from '../entities/BookGenre';

const bookRepository = AppDataSource.getRepository(Book);
const authorRepository = AppDataSource.getRepository(Author);
const genreRepository = AppDataSource.getRepository(Genre);
const bookInstanceRepository = AppDataSource.getRepository(BookInstance);
const bookGenreRepository = AppDataSource.getRepository(BookGenre);

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
      bookInstanceRepository.count({
        where: { status: BookInstanceStatus.Available },
      }),
      authorRepository.count(),
      genreRepository.count(),
    ]);

    res.render('index', {
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
export const book_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allBooks = await bookRepository.find({
        select: ['bookId', 'title', 'author'],
        relations: ['author'],
        order: { title: 'ASC' },
      });

      res.render('book/book_list', { book_list: allBooks });
    } catch (error) {
      next(error);
    }
  },
);

// detail book
export const book_detail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const book = await bookRepository.findOne({
      where: { bookId: req.params.id },
      relations: ['author', 'bookInstances'],
    });

    if (!book) {
      req.flash('error', req.t('home.no_book'));
      res.redirect('/books');
    }

    const bookInstance = book.bookInstances;
    const genre = await bookGenreRepository.find({
      where: { book: book },
      relations: ['genre'],
    });

    res.render('book/book_detail', {
      book: book,
      book_instances: bookInstance,
      genre: genre,
    });
  } catch (err) {
    next(err);
  }
};
