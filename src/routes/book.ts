import express from 'express';
const router = express.Router();
import BookController from '../controllers/BookController';

// Handle the GET request to "/"
router.get("/getBook", BookController.show)
router.post("/postBook", BookController.create)
router.put("/putBook", BookController.update)
router.delete("/deleteBook", BookController.remove)

export default router;
