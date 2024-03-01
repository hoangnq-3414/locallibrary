import express from 'express';
const router = express.Router();
import * as bookinstanceController from '../controllers/bookinstance.controller';

router.post('/update/:id', bookinstanceController.bookinstanceUpdatePost);
router.get('/update/:id', bookinstanceController.bookinstanceUpdateGet);
router.post('/remove', bookinstanceController.bookinstanceDeletePost);
router.get('/delete/:id', bookinstanceController.bookinstanceDeleteGet);
router.post('/store', bookinstanceController.bookinstanceCreatePost);
router.get('/new', bookinstanceController.bookinstanceCreateGet);
router.get('/:id', bookinstanceController.bookinstanceDetail);
router.get('/', bookinstanceController.bookinstanceList);

export default router;
