// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
},async (accessToken, refreshToken, profile, done) => {
    // Find or create a user in your database
    try{
    const user = await User.findOne({ googleId: profile.id });
    if (user) {
        return done(null, user);
    }
    const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
    });
    await newUser.save();
    done(null, newUser);
}catch(err){
    console.log(err);
}
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
