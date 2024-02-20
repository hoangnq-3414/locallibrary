import express from 'express';
import authorRoute from './author';
import booGenreRoute from './bookGenre';
import bookInstanceRoute from './bookInstance';
import bookRoute from './book';
import genreRoute from './genre';

const router = express.Router();

router.use('/author', authorRoute);
router.use('/book', bookRoute);
router.use('/bookGenre', booGenreRoute);
router.use('/bookInstance', bookInstanceRoute);
router.use('/genre', genreRoute);

export default router;
