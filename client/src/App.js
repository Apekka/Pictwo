import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      msg: ''
    };

    this.socket = io('http://localhost:5000');
  }

  componentDidMount() {

    this.socket.on('connect', () => { console.log('Connected'); });
    this.socket.on('chat message', (msg) => {
      this.setState({
        messages: [...this.state.messages, msg]
      });
    });
    this.socket.on('disconnect', () => { console.log('Disconnected'); });
  }

  sendMessage = (e) => {
    e.preventDefault();
    this.socket.emit('chat message', this.state.msg);
    this.setState({
      msg: ''
    });
  }

  changeMsg = (e) => {
    e.preventDefault();
    this.setState({
      msg: e.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <ul id="messages">
          {
            this.state.messages.map( (item, i) =>
              <li key={i}>{item}</li>
            )
          }
        </ul>

        <form onSubmit={ this.sendMessage }>
          <input value={this.state.msg} onChange={this.changeMsg}/><button>Send</button>
        </form>
      </div>
    );
  }
}

export default App;
