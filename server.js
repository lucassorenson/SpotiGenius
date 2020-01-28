const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors')
const SpotifyWebApi = require('spotify-web-api-node')
const folderForIndex = app.get("env") === 'development' ? 'public' : 'build'
const redirectUri = app.get("env") === 'development' ? 'http://localhost:5000/spotify-auth/callback' : '*PRODUCTION URI*'

app.use(cors({ origin: 'http://localhost:3000' }))

const spotifyApi = new SpotifyWebApi({
    clientId: 'a7e8b924f0734e9786ff52b834edba2e',
    clientSecret: '8075c06c97294d99bc0af5241e54776a',
    redirectUri: redirectUri
})

const spotifyAuthorizeURL = spotifyApi.createAuthorizeURL(['user-read-playback-state', 'user-read-currently-playing']);

app.get('/', (req, res) => {
    res.send('root route')
})


app.get('/spotify-auth', (req, res) => {
    res.redirect(spotifyAuthorizeURL)
})

app.get('/spotify-auth/callback', (req, res) => {
    spotifyApi.authorizationCodeGrant(req.query.code)
    .then((data) => {
          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        (err) => {
          console.log('Something went wrong at /spotify-auth/callback in server.js!', err);
        }
    )
    res.redirect('http://localhost:3000/profile')
})


app.get('/getProfile', (req, res) => {
    spotifyApi.getMe()
    .then(data => res.send({
        name: data.body.display_name
    }), (err) => {
        console.log('Something went wrong at /getProfile in server.js!', err)
    })
})

app.get('/getSong', (req, res) => {
    spotifyApi.getMyCurrentPlaybackState({})
    .then(data => {
        if (data.body.is_playing) {
            res.send({
                title: data.body.item.name,
                artist: data.body.item.artists[0].name,
                album: data.body.item.album.name
            })
        } else {
            res.send("No song playing")
        }
    }, (err) => {
        console.log('Something went wrong at /getSong in server.js!', err)
    })
})


app.use(express.static(path.join(__dirname, `client/${folderForIndex}`)));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/client/${folderForIndex}/index.html`));
})
app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});