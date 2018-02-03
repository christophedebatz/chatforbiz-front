import React, { Component } from 'react';
import socketIO from "socket.io-client";
import '../App.css';
import ChatWindow from '../Component/ChatWindow';

class ChatContainer extends Component {

  constructor() {
    super();
    this.state = {
      response: null,
      endpoint: 'http://127.0.0.1:3000'
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIO(endpoint);
    socket.on('message', response => this.setState({ response }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Chat4Biz</h1>
        </header>
        {this.state.response ?
          <ChatWindow message={this.state.response} />
          : "No messages" }
      </div>
    );
  }
}

export default ChatContainer;
