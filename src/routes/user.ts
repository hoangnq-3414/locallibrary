import express from 'express';
const router = express.Router();

// Handle the GET request to "/"
router.get('/', (req, res) => {
  res.send('user router alo alo 123');
});

export default router;
