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
    const genre = await genreRepository.findOne({
      where: { genreId: req.params.id },
    });
    if (!genre) {
      req.flash('error', 'Genre not found');
      res.redirect('/genres');
    }

    const bookGenres = await bookGenreRepository.find({
      where: { genre: genre },
      relations: ['book'],
    });

    const book = bookGenres.map((bookGenre) => ({
      bookId: bookGenre.book.bookId,
      title: bookGenre.book.title,
      summary: bookGenre.book.summary,
    }));

    res.render('genre/genre_detail', {
      title: 'Genre Detail',
      genre: genre,
      genre_books: book,
    });
  } catch (error) {
    next(error);
  }
};
