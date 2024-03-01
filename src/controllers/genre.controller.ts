import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Genre } from '../entities/Genre';
import { AppDataSource } from '../config/database';
import { BookGenre } from '../entities/BookGenre';
import { Result, body, validationResult } from 'express-validator';
import i18next from 'i18next';

const genreRepository = AppDataSource.getRepository(Genre);
const bookGenreRepository = AppDataSource.getRepository(BookGenre);

const getGenreDetails = async (genreId: number) => {
  return await genreRepository.findOne({
    where: { genreId: genreId },
  });
};

const getBookGenres = async (genre: Genre) => {
  return await bookGenreRepository.find({
    where: { genre: genre },
    relations: ['book'],
  });
};

// Display list of all Genre.
export const genreList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allGenres = await genreRepository.find();

      res.render('genre/genre_list', {
        genre_list: allGenres,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Detail genre
export const genreDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await getGenreDetails(req.params.id);

    const bookGenres = await getBookGenres(genre);

    if (!genre) {
      req.flash('error', req.t('home.no_genre'));
      return res.redirect('/genres');
    }

    res.render('genre/genre_detail', {
      genre: genre,
      books: bookGenres,
    });
  } catch (error) {
    next(error);
  }
};

// GET create form
export const getGenreCreateForm = (req: Request, res: Response) => {
  res.render('genre/genre_form');
};

// POST create form
export const postGenreCreateForm = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage(() => i18next.t('form.genre_valid'))
    .escape(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('genre/genre_form', {
        errors: errors.array(),
      });
      return;
    }

    const genre = new Genre();
    genre.name = req.body.name;

    const genreExists = await genreRepository.findOne({
      where: { name: req.body.name },
    });

    if (genreExists) {
      res.redirect('/genres');
    } else {
      await genreRepository.save(genre);
      res.redirect('/genres');
    }
  }),
];

// GET delete genre
export const genreDeleteGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await getGenreDetails(req.params.id);
    const bookGenres = await getBookGenres(genre);

    if (!genre) {
      req.flash('error', req.t('home.no_genre'));
      return res.redirect('/genres');
    }

    res.render('genre/genre_delete', {
      genre: genre,
      genre_books: bookGenres,
    });
  } catch (error) {
    next(error);
  }
};

// POST delete genre
export const genreDeletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genre = await getGenreDetails(req.params.id);

    const bookGenres = await getBookGenres(genre);

    if (bookGenres.length > 0) {
      res.render('genre_delete', {
        genre: genre,
        genre_books: bookGenres,
      });
    } else {
      await genreRepository.delete(req.params.id);
      res.redirect('/genres');
    }
  } catch (error) {
    next(error);
  }
};

// GET update genre
export const genreUpdateGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const genre = await getGenreDetails(req.params.id);

    if (!genre) {
      req.flash('error', req.t('home.no_genre'));
      return res.redirect('/genres');
    }

    res.render('genre/genre_form', { genre: genre });
  } catch (error) {
    next(error);
  }
};

// POST update genre
export const genreUpdatePost = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage(() => i18next.t('form.genre_valid'))
    .escape(),

  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);

      const genre = await getGenreDetails(req.params.id);

      if (!genre) {
        req.flash('error', req.t('home.no_genre'));
        return res.redirect('/genres');
      }

      genre.name = req.body.name;

      if (!errors.isEmpty()) {
        res.render('genre/genre_form', {
          genre: genre,
          errors: errors.array(),
        });
        return;
      } else {
        await genreRepository.save(genre);
        res.redirect('/genres');
      }
    } catch (error) {
      next(error);
    }
  },
];
