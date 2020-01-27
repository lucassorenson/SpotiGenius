import React, { Component } from 'react';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: ''
            },
            song: {
                title: '',
                artist: '',
                album: ''
            },
            authUrl: ''
        };
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.getSong = this.getSong.bind(this);
    }

    login() {
        fetch('http://localhost:5000/spotify-login')
        .then(res => res.text())
        .then(url => this.setState({authUrl: url}))
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
        .then(songData => this.setState({
            song: {
                title: songData.title,
                artist: songData.artist,
                album: songData.album
            }
        }))
    }

    componentDidMount() {
        this.getProfile()
    }

    render() {
        return ( <div>
            <h1>{ this.state.user.name }'s Profile</h1>
            <h2>Song Info</h2>
            <p>Song: { this.state.song.title }</p>
            <p>Artist: { this.state.song.artist }</p>
            <p>Album: { this.state.song.album }</p>
        </div> 
        )
    }
}

export default Profile;