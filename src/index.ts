import express from 'express';
import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import router from './routes';
import * as dotenv from 'dotenv';
import logger from 'morgan';

dotenv.config();
const app = express();
const port = 3000;
import { AppDataSource } from './config/database';
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set("views", path.join(__dirname, "views"));
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
