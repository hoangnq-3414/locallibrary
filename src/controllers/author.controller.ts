import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Author } from '../entities/Author';
import { AppDataSource } from '../config/database';
import { DateTime } from 'luxon';

const authorRepository = AppDataSource.getRepository(Author);

// Display list of all Authors.
export const author_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allAuthors = await authorRepository.find({
        order: { familyName: 'ASC' },
      });

      allAuthors.forEach((author) => {
        const Birth = new Date(author.dateOfBirth);
        const Death = new Date(author.dateOfDeath);
        author.dateOfBirth = DateTime.fromJSDate(Birth).toLocaleString(
          DateTime.DATE_MED,
        );
        author.dateOfDeath = DateTime.fromJSDate(Death).toLocaleString(
          DateTime.DATE_MED,
        );
      });

      res.render('author/author_list', {
        author_list: allAuthors,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Detail author
export const author_detail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const author = await authorRepository.findOne({
      where: { authorId: req.params.id },
      relations: ['books'],
    });

    if (!author) {
      req.flash('error', req.t('home.no_author'));
      return res.redirect('/authors');
    }

    res.render('author/author_detail', {
      author: author,
    });
  } catch (err) {
    next(err);
  }
};
