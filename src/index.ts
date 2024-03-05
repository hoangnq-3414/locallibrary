import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import router from './routes';
import * as dotenv from 'dotenv';
import logger from 'morgan';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';
import flash from 'connect-flash';
import createError from 'http-errors';

dotenv.config();
const app = express();
const port = 3000;
import { AppDataSource } from './config/database';
import { Request, Response, NextFunction } from 'express';
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'vi',
    preload: ['vi', 'en'],
    supportedLngs: ['vi', 'en'],
    saveMissing: true,
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'locale', //query string on url (?locale=en/vi)
      lookupCookie: 'locale',
      ignoreCase: true,
      cookieSecure: false,
    },
  });

app.use(i18nextMiddleware.handle(i18next));

// Use cookie-parser middleware
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse cookies
app.use(cookieParser());

// HTTP logger
app.use(logger('dev'));

// Use router
app.use(router);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err.stack);
  } else {
    res.status(500).send('Đã xảy ra lỗi!');
  }
});

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
