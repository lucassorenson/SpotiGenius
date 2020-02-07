require('dotenv').config()
var express = require('express');
var router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')
const SpotifyStrategy = require('passport-spotify').Strategy;
const redirectUri = (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://your-music-info.herokuapp.com') + '/spotify-auth/callback'


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirectUri
})



module.exports = function(passport, User) {
    passport.use(
        new SpotifyStrategy({
                clientID: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                callbackURL: redirectUri
            },
            function(accessToken, refreshToken, expires_in, profile, done) {
                const now = new Date()
                const expiresOn = new Date()
                expiresOn.setTime(now.getTime() + (expires_in * 1000))

                User.findOne({ Spotify_id: profile.id })
                    .then(function(user, err) {
                        if (user && user.Spotify_expires_on > now) {
                            spotifyApi.setAccessToken(user.Spotify_access_token)
                            spotifyApi.setRefreshToken(user.Spotify_refresh_token)
                            return done(null, user)
                        } else if (user && user.Spotify_expires_on <= now) {
                            spotifyApi.setRefreshToken(user.Spotify_refresh_token)
                            spotifyApi.refreshAccessToken().then(
                                function(data) {
                                    console.log('The access token has been refreshed!');
                                    spotifyApi.setAccessToken(data.body.access_token)
                                    user.Spotify_access_token = data.body.access_token
                                    user.Spotify_expires_on = expiresOn

                                    user.save()
                                        .then(function(user) {
                                            return done(null, user)
                                        })

                                },
                                function(err) {
                                    console.log('Could not refresh access token', err);
                                    return done(null, user)
                                }
                            );

                        } else {
                            let newUser = new User({
                                Spotify_id: profile.id,
                                Spotify_access_token: accessToken,
                                Spotify_expires_on: expiresOn,
                                Spotify_refresh_token: refreshToken
                            })
                            newUser.save()
                                .then(function(newUser) {
                                    return done(null, newUser)
                                })
                        }
                    })
            })
    )


    const spotifyAuthorizeURL = spotifyApi.createAuthorizeURL(['user-read-playback-state', 'user-read-currently-playing']);

    router.get('/spotify-auth', passport.authenticate('spotify', { scope: ['user-read-currently-playing', 'user-read-playback-state'] }))

    router.get('/spotify-auth/callback', passport.authenticate('spotify', { failureRedirect: '/' }), function(req, res) {
        req.session.user = req.user
        res.redirect('http://localhost:3000/profile')
    })

    router.get('/getProfile', (req, res) => {

        spotifyApi.getMe()
            .then(data => res.send({
                name: data.body.display_name
            }), (err) => {
                console.log('Something went wrong at /getProfile in spotify-routes.js!', err)
            })
    })

    router.get('/getSong', (req, res) => {
        spotifyApi.getMyCurrentPlaybackState({})
            .then(data => {
                if (data.body.is_playing) {
                    res.send({
                        isPlaying: true,
                        title: data.body.item.name,
                        artist: data.body.item.artists[0].name,
                        album: data.body.item.album.name,
                        timeLeft: data.body.item.duration_ms - data.body.progress_ms
                    })
                } else {
                    res.send({ isPlaying: false })
                }
            }, (err) => {
                console.log('Something went wrong at /getSong in spotify-routes.js!', err)
            })
    })
    return router
}