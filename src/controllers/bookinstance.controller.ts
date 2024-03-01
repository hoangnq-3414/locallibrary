import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { BookInstance } from '../entities/BookInstance';
import { AppDataSource } from '../config/database';
import { DateTime } from 'luxon';
import { Book } from '../entities/Book';
import { body, validationResult } from 'express-validator';
import i18next from 'i18next';

const bookInstanceRepository = AppDataSource.getRepository(BookInstance);
const bookRepository = AppDataSource.getRepository(Book);

const getBookInstanceDetails = async (instanceId: number) => {
  return await bookInstanceRepository.findOne({
    where: { instanceId: instanceId },
    relations: ['book'],
  });
};

// Display list of all BookInstances.
export const bookinstanceList = asyncHandler(
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
export const bookinstanceDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookInstance = await getBookInstanceDetails(req.params.id);

      if (!bookInstance) {
        req.flash('error', req.t('home.no_bookinstance'));
        res.redirect('/bookinstances');
      }

      res.render('bookinstance/bookinstance_detail', {
        bookinstance: bookInstance,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Function to get all books
const getAllBooks = async () => {
  return await bookRepository.find({
    order: { title: 'ASC' },
  });
};

// GET create form bookinstance
export const bookinstanceCreateGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookList = await getAllBooks();

    res.render('bookinstance/bookinstance_form', {
      book_list: bookList,
    });
  } catch (error) {
    next(error);
  }
};

// POST create bookinstance
export const bookinstanceCreatePost = [
  body('book', i18next.t('form.book_valid'))
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', i18next.t('form.imprint_valid'))
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', i18next.t('form.dueBack_valid'))
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const bookList = await getAllBooks();

        res.render('bookinstance/bookinstance_form', {
          book_list: bookList,
          errors: errors.array(),
          bookinstance: req.body,
        });
        return;
      }

      const bookInstance = new BookInstance();
      bookInstance.book = req.body.book;
      bookInstance.imprint = req.body.imprint;
      bookInstance.status = req.body.status;
      bookInstance.dueBack = req.body.due_back;

      await bookInstanceRepository.save(bookInstance);

      res.redirect('/bookinstances');
    } catch (error) {
      next(error);
    }
  },
];

// GET delete bookinstance
export const bookinstanceDeleteGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookInstance = await getBookInstanceDetails(req.params.id);

    if (!bookInstance) {
      req.flash('error', req.t('home.no_bookinstance'));
      res.redirect('/bookinstances');
    }

    return res.render('bookinstance/bookinstance_delete', {
      bookinstance: bookInstance,
    });
  } catch (error) {
    next(error);
  }
};

// POST delete bookinstance
export const bookinstanceDeletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await bookInstanceRepository.delete(req.body.id);
    res.redirect('/bookinstances');
  } catch (error) {
    next(error);
  }
};

// GET update bookinstance
export const bookinstanceUpdateGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get bookInstance and all books for form (in parallel)
    const bookInstance = await getBookInstanceDetails(req.params.id);

    const allBooks = await bookRepository.find({
      order: { title: 'ASC' },
    });

    if (!bookInstance) {
      req.flash('error', req.t('home.no_bookinstance'));
      res.redirect('/bookinstances');
    }

    res.render('bookinstance/bookinstance_form', {
      book_list: allBooks,
      selected_book: bookInstance.book.bookId,
      bookinstance: bookInstance,
    });
  } catch (error) {
    next(error);
  }
};

// POST update bookinstance
export const bookinstanceUpdatePost = [
  body('book', i18next.t('form.book_valid'))
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('imprint', i18next.t('form.imprint_valid'))
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', i18next.t('form.dueBack_valid'))
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);

      const bookInstance = await bookInstanceRepository.findOne({
        where: { instanceId: req.params.id },
      });
      if (!bookInstance) {
        req.flash('error', req.t('home.no_bookinstance'));
        res.redirect('/bookinstances');
      }

      bookInstance.book = req.body.book;
      bookInstance.imprint = req.body.imprint;
      bookInstance.status = req.body.status;
      bookInstance.dueBack = req.body.due_back;

      if (!errors.isEmpty()) {
        // There are errors.
        // Render the form again, passing sanitized values and errors.
        const allBooks = await bookRepository.find({
          order: { title: 'ASC' },
        });

        res.render('bookinstance_form', {
          book_list: allBooks,
          selected_book: bookInstance.book.bookId,
          errors: errors.array(),
          bookinstance: bookInstance,
        });
        return;
      } else {
        // Data from form is valid.
        await bookInstanceRepository.save(bookInstance);
        // Redirect to detail page.
        res.redirect('/bookinstances');
      }
    } catch (error) {
      next(error);
    }
  },
];
