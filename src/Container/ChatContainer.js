import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import PropTypes from 'prop-types';
import ChatWindow from '../Component/ChatWindow';
import ChatWriter from '../Component/ChatWriter';
import { messageService } from '../Service/messageService';
import '../index.css';

export default class ChatContainer extends Component {

  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.createSocket = this.createSocket.bind(this);
    this.scrollToLastMessage = this.scrollToLastMessage.bind(this);
    
    this.state = {
      response: null,
      previousMessages: []
    };
  }

  componentDidMount() {
    messageService.fetchLastMessages(this.props.user.token)
      .then(previousMessages => {
        previousMessages = previousMessages || [];
        this.setState({ previousMessages }, this.scrollToLastMessage);
      })
      .then(() => {
        this.createSocket();
        // this.socket.emit('action', JSON.stringify(this.props.user));
        this.socket.on('message', response => {
          if (response.error) {
            return this.props.onSendingError(response.error);
          }
          this.setState({ response });
        });
      });
  }

  onMessage(message) {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.emit('message', { user: this.props.user, text: message });
      } else {
        this.createSocket();
      }
      this.scrollToLastMessage();
      return resolve();
    });
  }

  createSocket() {
    this.socket = openSocket('http://127.0.0.1:3001');
  }

  scrollToLastMessage() {
    this.chatEndDiv.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <div className="chat-container">
        <div className="chat">
          <ChatWindow
            oldMessages={this.state.previousMessages}
            message={this.state.response}
            user={this.props.user}
          />
          <div
            style={{ paddingTop: '10px', clear: 'both' }}
            ref={el => { this.chatEndDiv = el; }}
          >
        </div>
        </div>
        <div className="form">
          <ChatWriter onMessage={this.onMessage} />
        </div>
      </div>
    );
  }
}

ChatContainer.propTypes = {
  user: PropTypes.object.isRequired,
  onSendingError: PropTypes.func.isRequired
};
