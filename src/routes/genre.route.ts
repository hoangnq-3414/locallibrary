import express from 'express';
const router = express.Router();
import * as genreController from '../controllers/genre.controller';

router.get('/:id', genreController.genre_detail);
router.get('/', genreController.genre_list);

export default router;
