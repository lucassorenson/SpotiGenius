import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLyrics: false,
            user: {
                name: ''
            },
            song: {
                title: '',
                isPlaying: false
            }
        };
        this.getProfile = this.getProfile.bind(this);
        this.getSong = this.getSong.bind(this);
        this.getLyrics = this.getLyrics.bind(this);
        this.sanitizeString = this.sanitizeString.bind(this);
    }

    sanitizeString(string) {
        return string.replace(/\u200B/g, '').replace(String.fromCharCode(8217), String.fromCharCode(39)).toLowerCase()
    }

    getProfile() {
        fetch('/getProfile')
            .then(res => res.json())
            .then(userData => this.setState({
                user: {
                    name: userData.name
                }
            }))
    }

    getSong() {
        fetch('/getSong')
            .then(res => res.json())
            .then(songData => {
                if (songData.isPlaying && songData.title !== this.state.song.title) {
                    this.setState({
                        song: {
                            title: this.sanitizeString(songData.title),
                            artist: this.sanitizeString(songData.artist),
                            album: this.sanitizeString(songData.album),
                            isPlaying: songData.isPlaying
                        }
                    })
                    this.getLyrics()
                } else if (!songData.isPlaying) {
                    this.setState({
                        song: {
                            isPlaying: false
                        }
                    })
                }
            })
    }

    getLyrics() {
        if (this.state.isLyrics) {
            window.location.reload()
        }

        fetch(`/getLyrics?title=${this.state.song.title}&artist=${this.state.song.artist}`)
            .then(data => data.json())
            .then(data => {
                if (!data.lyrics) {
                    alert("No songs found on Genius.com!")
                } else {
                    // There are 4 elements needed to make the Genius lyrics and annotations work:
                    // 1. embed-link  
                    document.getElementById('embed-link').innerHTML = `<div id='rg_embed_link_${data.songId}' class='rg_embed_link' data-song-id='${data.songId}'></div>`
                    // 2. genius-CSS
                    document.getElementById('genius-CSS').innerHTML = '<link href="https://assets.genius.com/stylesheets/compiled/embedded_song-6eaa5b243646673f94e5382277ba3902.css" media="screen" rel="stylesheet" type="text/css">'
                    // 3. lyrics
                    // eslint-disable-next-line
                    document.getElementById('lyrics').innerHTML = eval(data.lyrics)
                    // 4. lyrics-script  
                    document.getElementById('lyrics-script').src = 'https://assets.genius.com/javascripts/compiled/embedded_song-960e4685dd4d0ef829129bdd3a61098a.js'
                    // DO NOT MESS UP THE ORDER OF THESE, IT WILL BREAK
                    this.setState({isLyrics: true})
                }
            })
    }

    componentDidMount() {
        this.getProfile()
        window.setInterval(() => {
            this.getSong()
        }, 1500)
    }


    render() {
        let songInfo = (<div>
            <p>Song: {this.state.song.title}</p>
            <p>Artist: {this.state.song.artist}</p>
            <p>Album: {this.state.song.album}</p></div>)

        let noSongInfo = (<p>Please play a song</p>)

        return (<div>
            <h1>Welcome to SpotiGenius, {this.state.user.name}</h1>

            <h2>Song Info</h2>
            {this.state.song.isPlaying ? songInfo : noSongInfo}

            <div id="embed-link"></div>
            <div id="lyrics"></div>
        </div>
        )
    }
}

export default Profile;