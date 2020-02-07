var express = require('express');
var router = express.Router();
var api = require('genius-api')
var genius = new api(process.env.GENIUS_CLIENT_ACCESS_TOKEN)
var axios = require('axios')

function checkSong(hit, song) {
    return (
        hit.title.toLowerCase() === song.title.toLowerCase()
        && hit.primary_artist.name.toLowerCase() === song.artist.toLowerCase()
    )
}

router.get('/getLyrics', (req, res) => {
    genius.search(req.query.title)
        .then((data) => {
            let numHits = 0
            for (hit in data.hits) {
                if (checkSong(data.hits[hit].result, req.query)) {
                    let songId = data.hits[hit].result.id.toString()
                    axios.get(`https://genius.com/songs/${songId}/embed.js`)
                        .then((data) => {
                            res.send({
                                lyrics: data.data.match(/(?<=document.write)\(JSON.*/)[0],
                                songId: songId
                            })
                        })
                } else if (numHits++ >= data.hits.length - 1) {
                    res.send({
                        lyrics: null,
                        songId: null
                    })
                }


            }
        })
})


module.exports = router;