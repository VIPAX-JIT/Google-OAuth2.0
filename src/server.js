import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5678;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(
  session({
    secret: "mysecretkey", // normally from env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24*60*60*1000 }, // secure: true only with https
  })
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

export default app;