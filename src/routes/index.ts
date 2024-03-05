import express from 'express';
import authorRoute from './author.route';
import bookInstanceRoute from './bookInstance.route';
import bookRoute from './book.route';
import genreRoute from './genre.route';
import { Request, Response, NextFunction } from 'express';
import { index } from '../controllers/book.controller';
const router = express.Router();
// Handle the GET request to "/"
router.get('/', index);
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index');
});

router.use('/authors', authorRoute);
router.use('/books', bookRoute);
router.use('/bookinstances', bookInstanceRoute);
router.use('/genres', genreRoute);

export default router;
