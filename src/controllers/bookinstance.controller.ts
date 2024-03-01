import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { BookInstance } from '../entities/BookInstance';
import { AppDataSource } from '../config/database';
import { DateTime } from 'luxon';

const bookInstanceRepository = AppDataSource.getRepository(BookInstance);
// Display list of all BookInstances.
export const bookinstance_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allBookInstances = await bookInstanceRepository.find({
        relations: ['book'],
      });

      allBookInstances.forEach((bookInstance) => {
        const dueBackDate = new Date(bookInstance.dueBack);
        bookInstance.dueBack = DateTime.fromJSDate(dueBackDate).toLocaleString(
          DateTime.DATE_MED,
        );
      });

      res.render('bookinstance/bookinstance_list', {
        bookinstance_list: allBookInstances,
      });
    } catch (error) {
      next(error);
    }
  },
);

// detail bookinstance
export const bookinstance_detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookInstance = await bookInstanceRepository.findOne({
        where: { instanceId: req.params.id },
        relations: ['book'],
      });

      if (!bookInstance) {
        req.flash('error', req.t('home.no_bookinstance'));
        res.redirect('/bookinstances');
      }

      console.log(bookInstance);

      res.render('bookinstance/bookinstance_detail', {
        bookinstance: bookInstance,
      });
    } catch (err) {
      next(err);
    }
  },
);
