import { Request, Response } from 'express';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { Author } from '../entities/Author';
import { AppDataSource } from '../config/database';

const authorRepository = AppDataSource.getRepository(Author);

class AuthorController {
  show = asyncHandler(async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const author = await authorRepository.findOne({
        where: { authorId: id },
      });
      if (!author) {
        throw createError(404, 'Author not found');
      }
      res.json(author);
    } catch (error) {
      console.error('Error in show method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // POST /authors/create
  create = asyncHandler(async (req: Request, res: Response) => {
    try {
      const newAuthor = authorRepository.create(req.body);
      const savedAuthor = await authorRepository.save(newAuthor);
      res.json(savedAuthor);
    } catch (error) {
      console.error('Error in create method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // PUT /authors/update
  update = asyncHandler(async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.body.authorId);
      const existingAuthor = await authorRepository.findOne({
        where: { authorId: id },
      });
      if (!existingAuthor) {
        throw createError(404, 'Author not found');
      }
      authorRepository.merge(existingAuthor, req.body);
      const updatedAuthor = await authorRepository.save(existingAuthor);
      res.json(updatedAuthor);
    } catch (error) {
      console.error('Error in update method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // DELETE /authors/remove
  remove = asyncHandler(async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      const deleteResult = await authorRepository.delete(authorId);
      if (deleteResult.affected === 0) {
        throw createError(404, 'Author not found');
      }
      res.send('Author deleted successfully');
    } catch (error) {
      console.error('Error in delete method:', error);
      res.status(500).send('Internal Server Error');
    }
  });
}

export default new AuthorController();
