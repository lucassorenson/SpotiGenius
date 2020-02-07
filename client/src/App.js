import React, { Component } from 'react';
import './App.css';

class App extends Component {
    render() {
        const loginUri = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/spotify-auth' : 'https://your-music-info.herokuapp.com/spotify-auth'
        return (<div>
            <h1>Your Music</h1>
            <p>Get useful information about the music you are listening to</p>
            <a href={loginUri} className="button">Login</a>
        </div>

);  
    }
}

export default App;