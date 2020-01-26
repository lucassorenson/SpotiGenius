import React, { Component } from 'react';
import './App.css';
import { Link }
 from 'react-router-dom'
class App extends Component {
    render() {
        return (<div>
            <h1>Your Music</h1>
            <p>Get useful information about the music you are listening to</p>
            <Link to="/profile">Profile</Link>
        </div>);  
    }
}

export default App;