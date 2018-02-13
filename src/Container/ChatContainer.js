import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import PropTypes from 'prop-types';
import ChatWindow from '../Component/ChatWindow';
import ChatWriter from '../Component/ChatWriter';
import ChatAction from '../Component/ChatAction';
import { messageService } from '../Service/messageService';
import '../index.css';

export default class ChatContainer extends Component {

  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    this.onType = this.onType.bind(this);
    this.createSocket = this.createSocket.bind(this);
    this.scrollToLastMessage = this.scrollToLastMessage.bind(this);

    this.state = {
      message: null,
      actions: [],
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
        this.socket.on('action', action => {
          this.state.actions.push(action);
          this.setState({ action: this.state.actions })
        });
        this.socket.on('message', message => {
          if (message.error) {
            return this.props.onSendingError(message.error);
          }
          const actions = this.state.actions;
          for (let i = 0; i < actions.length; i++) {
            if (actions[i].user.id === message.user.id) {
              actions.splice(i, 1);
            }
          }
          this.setState({ message, actions });
        });
      });
  }

  onMessage(message) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        this.createSocket();
      }
      this.socket.emit('message', { user: this.props.user, text: message });
      this.scrollToLastMessage();
      return resolve();
    });
  }

  onType() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        this.createSocket();
      }
      this.socket.emit('action', { user: this.props.user, type: 'typing' });
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
            message={this.state.message}
            user={this.props.user}
          />
          <div
            style={{ paddingTop: '65px', clear: 'both' }}
            ref={el => { this.chatEndDiv = el; }}
          >
          </div>
        </div>
        <div>
          <ChatAction actions={this.state.actions} />
        </div>
        <div className="form">
          <ChatWriter onMessage={this.onMessage} onType={this.onType} />
        </div>
      </div>
    );
  }
}

ChatContainer.propTypes = {
  user: PropTypes.object.isRequired,
  onSendingError: PropTypes.func.isRequired
};
