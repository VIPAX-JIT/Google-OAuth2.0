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
const CALLBACK_URL = process.env.CALLBACK_URL;

app.use(
  session({
    secret: "mysecretkey", // normally from env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24*60*60*1000 }, // secure: true only with https
  })
);

app.use(passport.initialize());
app.use(passport.session());



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      // });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

function isLoggedIn(req,res,next){
  req.user?next():res.redirect("/");
};
app.get("/",(req,res)=>{
  res.send('<a href="/auth/google">Login with GOOGLE</a>');
});
app.get("/auth/google",
  passport.authenticate("google",{scope:["profile","email"]})
);

app.get("/auth/google/callback",
  passport.authenticate("google",
    {
      failureRedirect: "/auth/failure",
      successRedirect: "/protected",
    }
  )

);
app.get("/protected",isLoggedIn,(req,res)=>{
  if (req.user) { 
  res.send("YOU ARE AUTHENTICATED USER")
  }else{
    res.send("YO ARE NOT AUTHENTICATED")
  }
});

app.get("/auth/failure",(req,res)=>{
  res.send("AUTH MAI ERROR..!!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

export default app;