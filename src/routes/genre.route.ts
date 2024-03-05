import express from 'express';
const router = express.Router();
import * as genreController from '../controllers/genre.controller';

router.post('/update/:id', genreController.genreUpdatePost);
router.get('/update/:id', genreController.genreUpdateGet);
router.post('/remove/:id', genreController.genreDeletePost);
router.get('/delete/:id', genreController.genreDeleteGet);
router.get('/new', genreController.getGenreCreateForm);
router.post('/store', genreController.postGenreCreateForm);
router.get('/:id', genreController.genreDetail);
router.get('/', genreController.genreList);

export default router;
