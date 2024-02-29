import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Genre } from '../entities/Genre';
import { AppDataSource } from '../config/database';
import { BookGenre } from '../entities/BookGenre';

const genreRepository = AppDataSource.getRepository(Genre);
const bookGenreRepository = AppDataSource.getRepository(BookGenre);

// Display list of all Genre.
export const genre_list = asyncHandler(
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
export const genre_detail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookGenres = await bookGenreRepository.find({
      where: {
        genre: {
          genreId: req.params.id,
        },
      },
      relations: ['genre', 'book'],
    });

    if (!bookGenres) {
      req.flash('error', req.t('home.no_genre'));
      return res.redirect('/genres');
    }

    res.render('genre/genre_detail', {
      title: 'Genre Detail',
      genre: bookGenres,
    });
  } catch (error) {
    next(error);
  }
};
