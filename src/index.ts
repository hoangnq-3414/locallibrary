import express from 'express';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import router from './routes';
import logger from 'morgan';
import connnection from './connect';

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'pug');

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// HTTP logger
app.use(logger('dev'));

// Use router
app.use(router);

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

connnection;
