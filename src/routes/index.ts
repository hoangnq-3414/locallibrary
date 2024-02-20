import express from 'express';
import authorRoute from './author.route';
import booGenreRoute from './bookGenre.route';
import bookInstanceRoute from './bookInstance.route';
import bookRoute from './book.route';
import genreRoute from './genre.route';
import { Request, Response, NextFunction } from 'express';
import { index } from '../controllers/book.controller'
const router = express.Router();

router.get('/', index)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index');
})

router.use('/author', authorRoute);
router.use('/book', bookRoute);
router.use('/bookGenre', booGenreRoute);
router.use('/bookInstance', bookInstanceRoute);
router.use('/genre', genreRoute);

export default router;
