import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: ''
            },
            song: {
                isPlaying: false
            }
        };
        this.getProfile = this.getProfile.bind(this);
        this.getSong = this.getSong.bind(this);
        this.getLyrics = this.getLyrics.bind(this);
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

    setSongTimer(timeLeft) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => this.getSong(), timeLeft)
    }

    getSong() {
        fetch('/getSong')
            .then(res => res.json())
            .then(songData => {
                if (songData.isPlaying) {
                    this.setSongTimer(songData.timeLeft)
                    this.setState({
                        song: {
                            title: songData.title,
                            artist: songData.artist,
                            album: songData.album,
                            isPlaying: songData.isPlaying
                        }
                    })
                } else {
                    this.setState({
                        song: {
                            isPlaying: false
                        }
                    })
                }
            })
    }

    getLyrics() {
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
                }
            })
    }

    componentDidMount() {
        this.getProfile()
        this.getSong()
    }



    render() {
        let songInfo = (<div>
            <p>Song: {this.state.song.title}</p>
            <p>Artist: {this.state.song.artist}</p>
            <p>Album: {this.state.song.album}</p></div>)

        let noSongInfo = (<p>Please play a song</p>)

        return (<div>
            <h1>{this.state.user.name}'s Profile</h1>
            <button onClick={this.getSong} className="button">Refresh Song</button>

            <h2>Song Info</h2>
            {this.state.song.isPlaying ? songInfo : noSongInfo}

            <button onClick={this.getLyrics} className="button">Get Lyrics</button>

            <div id="embed-link"></div>
            <div id="lyrics"></div>
        </div>
        )
    }
}

export default Profile;