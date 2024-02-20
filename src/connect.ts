import mysql, { Connection } from 'mysql';
import dotenv from 'dotenv';

dotenv.config(); // tải biến môi trường

const connnection: Connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connnection.connect((err) => {
  if (err) {
    console.error('kết nối CSDL không thành công ' + err.stack);
    return;
  }
  console.log('kết nối CDSL thành công');
});

export default connnection;
