import express from 'express';
const router = express.Router();
import * as authorController from '../controllers/author.controller';

// Handle the GET request to "/"

router.post('/update/:id', authorController.authorUpdatePost);
router.get('/update/:id', authorController.authorUpdateGet);
router.post('/remove/:id', authorController.authorDeletePost);
router.get('/delete/:id', authorController.authorDeleteGet);
router.get('/new', authorController.getAuthorCreateForm);
router.post('/store', authorController.postAuthorCreateForm);
router.get('/:id', authorController.authorDetail);
router.get('/', authorController.authorList);
export default router;
