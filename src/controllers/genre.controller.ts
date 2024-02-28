import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Genre } from '../entities/Genre';
import { AppDataSource } from '../config/database';

const genreRepository = AppDataSource.getRepository(Genre);

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

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
  },
);

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre create GET');
  },
);

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre create POST');
  },
);

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
  },
);

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
  },
);

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
  },
);

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
  },
);
