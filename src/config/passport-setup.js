import bcryptjs from "bcryptjs";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import User from "../models/user";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("deserialize", err.messsage);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    googleAuth
  )
);

passport.use(new LocalStrategy({usernameField: "email"}, localAuth));

async function googleAuth(accessToken, refreshToken, profile, done) {
  try {
    const currentUser = await User.findOne({googleId: profile.id});
    if (currentUser) {
      done(null, currentUser);
    } else {
      const newUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        thumbnail: profile._json.picture
      }).save();

      done(null, newUser);
    }
  } catch (err) {
    console.log("strategy", err.messsage);
  }
}

const compareHash = (p, hash) => {
  return bcryptjs.compare(p, hash);
};

async function localAuth(email, password, done) {
  try {
    const user = await User.findOne({email: escape(email)});
    if (user === null) {
      return done(null, false);
    }

    const validPassword = await compareHash(escape(password), user.password);

    if (!validPassword) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
