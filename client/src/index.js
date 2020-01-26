import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Profile from './Profile'
import { Route, BrowserRouter as Router } from 'react-router-dom'


const routing = (
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/profile" component={Profile} />
        </div>
    </Router>
)
ReactDOM.render( routing , document.getElementById('root'));