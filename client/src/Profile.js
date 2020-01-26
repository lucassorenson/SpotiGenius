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