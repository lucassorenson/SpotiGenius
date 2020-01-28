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

    componentDidMount() {
        this.getProfile()
        this.getSong()
    }



    render() {

        let songInfo = (<div>
            <p>Song: { this.state.song.title }</p>
            <p>Artist: { this.state.song.artist }</p>
            <p>Album: { this.state.song.album }</p></div>)
        
        let noSongInfo = (<p>Please play a song</p>)

        return ( <div>
            <h1>{ this.state.user.name }'s Profile</h1>
            <button onClick={this.getSong}>Refresh Song</button>
            <h2>Song Info</h2>
            {this.state.song.isPlaying ? songInfo : noSongInfo}
        </div> 
        )
    }
}

export default Profile;