const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const passport = require('passport');
const User = require('./database.js')
const session = require('express-session')

const folderForIndex = process.env.NODE_ENV === 'development' ? 'public' : 'build'


app.use(session({
    secret: process.env.SESSION_SECRET,
    path: '/',
    saveUninitialized: true, 
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, `client/${folderForIndex}`)));
app.use(cors({ origin: ['*', 'http://localhost:3000', 'http://localhost:5000'], credentials: true}))


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ spotifyId: id }, function (err, user) {
        done(err, user)
    })
});

app.use(require('./routes/spotify-routes.js')(passport, User))
app.use(require('./routes/genius-routes.js'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/client/${folderForIndex}/index.html`));
})

app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});

module.exports = app