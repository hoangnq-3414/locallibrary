import express from 'express';
const router = express.Router();
import * as authorController from '../controllers/author.controller';

// Handle the GET request to "/"

router.get('/:id', authorController.author_detail);
router.get('/', authorController.author_list);
export default router;
