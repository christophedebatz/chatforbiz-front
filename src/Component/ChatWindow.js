import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { chatStore } from '../Store/chatStore';
import '../index.css';

export default class ChatWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: chatStore.getMessages()
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps) {
      chatStore.addMessage(newProps);
      this.setState({ messages: chatStore.getMessages() });
    }
  }

  render() {
    return (
      <div>
        {this.state.messages.map((item, index) => {
          const m = moment(item.message.creationDate);
          const date = m.format('DD/MM');
          const time = m.format('hh:mm');
          if (item.message.user.id === this.props.user.id) {
            return (
              <div className="clear">
              <div className="date">The {date} at {time}</div>
                <div className="bubble me" key={index}>
                  <span className="name">You</span>
                  <div className="text">{item.message.text}</div>
                </div>
              </div>
            );
          }
          return (
            <div className="clear">
            <div className="date">The {date} at {time}</div>
              <div className="bubble" key={index}>
                <span className="name">{item.message.name}</span>
                <div className="text">{item.message.text}</div>
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
