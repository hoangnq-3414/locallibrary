import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/book.controller';

router.get('/:id', bookController.book_detail);
router.get('/', bookController.book_list);

export default router;
