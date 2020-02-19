import React, { Component } from 'react';
import './App.css';

class App extends Component {
    render() {
        const loginUri = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/spotify-auth' : 'https://your-music-info.herokuapp.com/spotify-auth'
        return (<div>
            <h1>SpotiGenius</h1>
            <p>Integrate Spotify and Genius to automatically pull lyrics for your music</p>
            <a href={loginUri} className="button">Login to Spotify</a>
            <p>Your password will not be sent to or saved on our servers. Spotify sends us an authorization code that can be used to check what song you are playing.</p>
        </div>

);  
    }
}

export default App;