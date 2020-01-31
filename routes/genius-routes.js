var express = require('express');
var router = express.Router();
var api = require('genius-api')
var genius = new api(process.env.GENIUS_CLIENT_ACCESS_TOKEN)

const Vals = {
    song: 'take me to church',
    album: 'hozier',
    artist: 'hozier'
}

function checkSong(data) {
    return (
        data.title.toLowerCase() === Vals.song.toLowerCase() 
        && data.primary_artist.name.toLowerCase() === Vals.artist.toLowerCase()
    )
}

router.get('/getLyrics', (req, res) => {
   genius.search(Vals.song)
   .then((data) => {
        for (hit in data.hits) {
            if (checkSong(data.hits[hit].result)) {
                genius.song(data.hits[hit].result.id)
                .then(data => console.log(data.song))
            }
        }
   })
})


module.exports = router;