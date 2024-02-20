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

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
  },
);

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
  },
);

// Handle BookInstance create on POST.
exports.bookinstance_create_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
  },
);

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
  },
);

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
  },
);

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
  },
);

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
  },
);
