import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { Author } from '../entities/Author';
import { AppDataSource } from '../config/database';
import { DateTime } from 'luxon';
import { body, validationResult } from 'express-validator';

const authorRepository = AppDataSource.getRepository(Author);

export const findAuthorById = async (authorId: number) => {
  return await authorRepository.findOne({
    where: { authorId: authorId }
  });
};

export const findAuthorWithBook = async (authorId: number) => {
  return await authorRepository.findOne({
    where: { authorId: authorId },
    relations: ['books'],
  })
}

export const handleAuthorNotFound = (author: any, req: Request, res: Response) => {
  handleAuthorNotFound(author, req, res);
};

// Display list of all Authors.
export const authorList = asyncHandler(
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
        if (author.dateOfDeath) {
          const Death = new Date(author.dateOfDeath);
          author.dateOfDeath = DateTime.fromJSDate(Death).toLocaleString(
            DateTime.DATE_MED,
          );
        }
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
export const authorDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const author = await findAuthorWithBook(req.params.id);

    handleAuthorNotFound(author, req, res);

    res.render('author/author_detail', {
      author: author,
    });
  } catch (err) {
    next(err);
  }
};

// GET create author
export const getAuthorCreateForm = (req: Request, res: Response) => {
  res.render('author/author_form');
};

// POST create author
export const postAuthorCreateForm = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('author/author_form', {
          errors: errors.array(),
        });
        return;
      }

      const { first_name, family_name, date_of_birth } = req.body;

      const author = new Author();
      author.firstName = first_name;
      author.familyName = family_name;
      author.dateOfBirth = date_of_birth;
      author.name = `${first_name} ${family_name}`;

      await authorRepository.save(author);

      res.redirect('/authors');
    } catch (error) {
      next(error);
    }
  }
];

// GET delete author
export const authorDeleteGet = async (req: Request, res: Response) => {
  const author = await findAuthorWithBook(req.params.id);
  handleAuthorNotFound(author, req, res);
  const allBooksByAuthor = author?.books;
  res.render('author/author_delete', {
    author: author,
    authorBooks: allBooksByAuthor,
  });
};

// POST delete author
export const authorDeletePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const author = await findAuthorWithBook(req.params.id);

    const allBooksByAuthor = author.books;

    if (allBooksByAuthor.length > 0) {
      res.render('author/author_delete', {
        author: author,
        authorBooks: allBooksByAuthor,
      });
      return;
    } else {
      await authorRepository.delete(req.params.id);
      res.redirect('/authors');
    }
  },
);

// GET author update
export const authorUpdateGet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const author = await findAuthorById(req.params.id);

    handleAuthorNotFound(author, req, res);

    res.render("author/author_form", { author: author });
  } catch (error) {
    next(error);
  }
};

// POST author update
export const authorUpdatePost = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const author = await findAuthorById(req.params.id);
        handleAuthorNotFound(author, req, res);
        res.render("author/author_form", {
          author: author,
          errors: errors.array(),
        });
        return;
      } else {

        const author = await findAuthorById(req.params.id);
        handleAuthorNotFound(author, req, res);
        author.firstName = req.body.first_name;
        author.familyName = req.body.family_name;
        author.dateOfBirth = req.body.date_of_birth;
        author.dateOfDeath = req.body.date_of_death;
        author.name = `${req.body.first_name} ${req.body.family_name}`;

        await authorRepository.save(author);
        res.redirect('/authors');
      }
    } catch (error) {
      next(error);
    }
  },
];
