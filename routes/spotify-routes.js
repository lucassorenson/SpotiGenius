require('dotenv').config()
var express = require('express');
var router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node')
const redirectUri = (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://your-music-info.herokuapp.com') + '/spotify-auth/callback'

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirectUri
})

const spotifyAuthorizeURL = spotifyApi.createAuthorizeURL(['user-read-playback-state', 'user-read-currently-playing']);

router.get('/spotify-auth', (req, res) => {
    res.redirect(spotifyAuthorizeURL)
})

router.get('/spotify-auth/callback', (req, res) => {
    spotifyApi.authorizationCodeGrant(req.query.code)
    .then((data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        tokenExpirationEpoch = new Date().getTime() / 1000 + data.body['expires_in'];
    }, (err) => {
        console.log('Something went wrong at /spotify-auth/callback in spotify-routes.js!', err);
    })
    .then(() => {
        setInterval(function() {
            clearInterval(this);
            spotifyApi.refreshAccessToken()
            .then(function(data) {
                    tokenExpirationEpoch =new Date().getTime() / 1000 + data.body['expires_in'];
                }, function(err) {
                    console.log('Could not refresh the token!', err.message);
                });
            }, (tokenExpirationEpoch - new Date().getTime() / 1000))
    })

    

    res.redirect(`${req.headers.referer}profile`)
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
            res.send({isPlaying: false})
        }
    }, (err) => {
        console.log('Something went wrong at /getSong in spotify-routes.js!', err)
    }) 
})

module.exports = router;