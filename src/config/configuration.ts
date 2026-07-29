import 'dotenv/config';

export default () => ({
  port: Number(process.env.PORT) || 3000,
  secrets: {
    jwt_secret: process.env.JWT_SECRET,
  },
  database: {
    host: process.env.DATABASE_HOST,
  },
});
