import 'dotenv/config';

const env = {
  PORT: Number(process.env.PORT ?? 4000),

  // Gmail via Nodemailer (App Password required)
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.EMAIL_USER || '',

  // MSSQL
  DB_SERVER: process.env.DB_SERVER,
  DB_PORT: Number(process.env.DB_PORT ?? 1433),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_ENCRYPT: (process.env.DB_ENCRYPT ?? 'true').toLowerCase() === 'true',
  DB_TRUST_CERT: (process.env.DB_TRUST_CERT ?? 'false').toLowerCase() === 'true',
};

export default env;
