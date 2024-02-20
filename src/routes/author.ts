import express from 'express';
const router = express.Router();
import AuthorController from '../controllers/AuthorController';

// Handle the GET request to "/"
router.get('/getAuthor/:id', AuthorController.show);
router.post('/postAuthor', AuthorController.create);
router.put('/putAuthor', AuthorController.update);
router.delete('/deleteAuthor/:id', AuthorController.remove);

export default router;
