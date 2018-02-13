import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { chatStore } from '../Store/chatStore';
import '../index.css';

export default class ChatWindow extends Component {

  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.oldLoaded = false;
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.oldMessages.length > 0) {
      if (!this.oldLoaded) {
        this.oldLoaded = true;
        chatStore.clear();
        newProps.oldMessages.forEach(message => {
          chatStore.addMessage(message);
        });
      }
    }
    if (newProps && newProps.message) {
      chatStore.addMessage(newProps.message);
    }
    this.setState({ messages: chatStore.getMessages() });
  }

  render() {
    return (
      <div>
        {this.state.messages.map((message, index) => {
          const m = moment(message.creationDate);
          const date = m.format('DD/MM');
          const time = m.format('HH:mm');
          if (message.user && message.user.id === this.props.user.id) {
            return (
              <div key={index}>
                <div className="clear">
                <div className="date">The {date} at {time}</div>
                  <div className="bubble me">
                    <span className="name">You</span>
                    <div className="text">{message.text}</div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={index}>
              <div className="clear">
              <div className="date">The {date} at {time}</div>
                <div className="bubble">
                  <span className="name">{message.name}</span>
                  <div className="text">{message.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ChatWindow.propTypes = {
  user: PropTypes.object.isRequired
};
