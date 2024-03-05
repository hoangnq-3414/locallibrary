import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/book.controller';

router.post('/update/:id', bookController.bookUpdatePost);
router.get('/update/:id', bookController.bookUpdateGet);
router.post('/remove/:id', bookController.bookDeletePost);
router.get('/delete/:id', bookController.bookDeleteGet);
router.post('/store', bookController.bookCreatePost);
router.get('/new', bookController.bookCreateGet);
router.get('/:id', bookController.bookDetail);
router.get('/', bookController.bookList);

export default router;
