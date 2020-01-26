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
            }
        };
        this.connectToServer = this.connectToServer.bind(this);
    }

    connectToServer() {
        fetch('/getProfile')
        .then(res => res.json())
        .then(data => this.setState({
            user: {
                name: data.user.name
            },
            song: {
                title: data.song.title,
                artist: data.song.artist,
                album: data.song.album
            }
        }))
    }

    componentDidMount(){
        this.connectToServer()
    }
    
    render() {
        return (<div>
            <h1>{this.state.user.name}'s Profile</h1>
            <h2>Song Info</h2>
            <p>Song: {this.state.song.title}</p>
            <p>Artist: {this.state.song.artist}</p>
            <p>Album: {this.state.song.album}</p>
        </div>);  
    }
}

export default Profile;