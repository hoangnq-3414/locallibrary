import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';

// Sử dụng morgan để ghi log ra console
const logger = morgan('dev');

class BookController {
  // GET /authors/:id
  show = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Code xử lý
      res.send('Hello from show method');
    } catch (error) {
      logger.error('Error in show method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // POST /authors/create
  create = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Code xử lý
      res.send('Hello from create method');
    } catch (error) {
      logger.error('Error in create method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // PUT /authors/update
  update = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Code xử lý
      res.send('Hello from update method');
    } catch (error) {
      logger.error('Error in update method:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // DELETE /authors/remove
  remove = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Code xử lý
      res.send('Hello from delete method');
    } catch (error) {
      logger.error('Error in delete method:', error);
      res.status(500).send('Internal Server Error');
    }
  });
}

export default new BookController();
