import express from 'express';
const router = express.Router();

// Handle the GET request to "/"
router.get('/', (req, res) => {
  res.send('user router 1245');
});

export default router;
