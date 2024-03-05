import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { Author } from '../entities/Author';
import { Genre } from '../entities/Genre';
import { BookInstance } from '../entities/BookInstance';
import { BookInstanceStatus } from '../untils/constants';
import { BookGenre } from '../entities/BookGenre';
import { body, validationResult } from 'express-validator';
import i18next from 'i18next';

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
  } catch (error) {
    next(error);
  }
};

// Display list of all books.
export const bookList = asyncHandler(
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
export const bookDetail = async (
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

// Function to get all authors and genres
const getAllAuthorsAndGenres = async () => {
  const [allAuthors, allGenres] = await Promise.all([
    authorRepository.find({ order: { familyName: 'ASC' } }),
    genreRepository.find({ order: { name: 'ASC' } }),
  ]);
  return { allAuthors, allGenres };
};

// GET create book
export const bookCreateGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { allAuthors, allGenres } = await getAllAuthorsAndGenres();

    res.render('book/book_form', {
      authors: allAuthors,
      genres: allGenres,
    });
  } catch (error) {
    next(error);
  }
};

// POST create book
export const bookCreatePost = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
          typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.title_valid'))
    .escape(),
  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.author_valid'))
    .escape(),
  body('summary')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.summary_valid'))
    .escape(),
  body('isbn')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.isbn_valid'))
    .escape(),
  body('genre.*').escape(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      const { title, author, summary, isbn, genre } = req.body;

      const book = new Book();
      book.title = title;
      book.author = author;
      book.summary = summary;
      book.ISBN = isbn;

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
        const { allAuthors, allGenres } = await getAllAuthorsAndGenres();

        res.render('book/book_form', {
          authors: allAuthors,
          genres: allGenres,
          book: book,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save book.
        await bookRepository.save(book);

        for (const genreId of genre) {
          const bookGenre = new BookGenre();
          bookGenre.book = book;
          bookGenre.genre = genreId;
          await bookGenreRepository.save(bookGenre);
        }
        res.redirect('/books');
      }
    } catch (error) {
      next(error);
    }
  },
];

// Function to get book details including genres and instances
const getBookDetails = async (id: number) => {
  const book = await bookRepository.findOne({
    where: { bookId: id },
    relations: ['author', 'bookInstances'],
  });

  const genre = await bookGenreRepository.find({
    where: { book: book },
    relations: ['genre'],
  });

  const bookInstances = book.bookInstances;

  return { book, genre, bookInstances };
};

// GET delete book
export const bookDeleteGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { book, genre, bookInstances } = await getBookDetails(req.params.id);

    if (!book) {
      req.flash('error', req.t('home.no_book'));
      res.redirect('/books');
    }

    return res.render('book/book_delete', {
      book: book,
      genre: genre,
      book_instances: bookInstances,
    });
  } catch (error) {
    next(error);
  }
};

// POST delete book
export const bookDeletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { book, genre, bookInstances } = await getBookDetails(req.params.id);

    if (!book) {
      req.flash('error', req.t('home.no_book'));
      res.redirect('/books');
    }

    if (bookInstances.length > 0) {
      // Sách có các phiên bản. Hiển thị form xóa tương tự như trang GET.
      return res.render('book/book_delete', {
        book: book,
        genre: genre,
        book_instances: bookInstances,
      });
    } else {
      for (const bookGenre of genre) {
        await bookGenreRepository.delete(bookGenre.bookGenderId);
      }
      await bookRepository.delete(req.params.id);
      return res.redirect('/books');
    }
  } catch (error) {
    next(error);
  }
};

// Function to get book details including authors and genres
const getBookDetailsWithAuthorsAndGenres = async (id: number) => {
  const [book, allAuthors, allGenres] = await Promise.all([
    bookRepository.findOne({
      where: { bookId: id },
      relations: ['author'],
    }),
    authorRepository.find({ order: { familyName: 'ASC' } }),
    genreRepository.find({ order: { name: 'ASC' } }),
  ]);

  return { book, allAuthors, allGenres };
};

// GET update book
export const bookUpdateGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { book, allAuthors, allGenres } =
      await getBookDetailsWithAuthorsAndGenres(req.params.id);

    res.render('book/book_form', {
      authors: allAuthors,
      genres: allGenres,
      book: book,
    });
  } catch (error) {
    next(error);
  }
};

// POST update book
export const bookUpdatePost = [
  // Convert genre to an array.
  (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.title_valid'))
    .escape(),
  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.author_valid'))
    .escape(),
  body('summary')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.summary_valid'))
    .escape(),
  body('isbn')
    .trim()
    .isLength({ min: 1 })
    .withMessage(() => i18next.t('form.isbn_valid'))
    .escape(),
  body('genre.*').escape(),

  // Handle request after validation and sanitization.
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      const { book, allAuthors, allGenres } =
        await getBookDetailsWithAuthorsAndGenres(req.params.id);

      if (!book) {
        req.flash('error', req.t('home.no_book'));
        res.redirect('/books');
      }

      book.title = req.body.title;
      book.author = req.body.author;
      book.summary = req.body.summary;
      book.ISBN = req.body.isbn;

      if (!errors.isEmpty()) {
        res.render('book_form', {
          authors: allAuthors,
          genres: allGenres,
          book: book,
          errors: errors.array(),
        });
      } else {
        await bookRepository.save(book);
        await bookGenreRepository.delete({ book: book });
        for (const genreId of req.body.genre) {
          const bookGenre = new BookGenre();
          bookGenre.book = book;
          bookGenre.genre = genreId;
          await bookGenreRepository.save(bookGenre);
        }
        res.redirect(`/books/${book.bookId}`);
      }
    } catch (error) {
      next(error);
    }
  },
];
