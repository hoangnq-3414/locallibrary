import express from 'express';
const router = express.Router();
import * as bookinstanceController from '../controllers/bookinstance.controller';

router.get('/', bookinstanceController.bookinstance_list);

export default router;
