import express from 'express';
const router = express.Router();
import * as bookController from '../controllers/book.controller';

router.get('/', bookController.book_list);

export default router;
