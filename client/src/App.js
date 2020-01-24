import React, { Component } from 'react';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {render: 'a'};
        this.test = this.test.bind(this);
    }
    
    render() {
        return (<div></div>);  
    }
}

export default App;