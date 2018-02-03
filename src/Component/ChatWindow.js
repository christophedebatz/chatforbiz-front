import React, { Component } from 'react';

class ChatWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps) {
      this.state.messages.push(newProps);
      this.setState();
    }
  }

  render() {
    return (
      <div>
        {this.state.messages.map((item, index) => (
          <div className="message" key={index}>
            <div className="message-head">
              <span className="name">{item.name}</span>
              <span className="date">{item.date}</span>
            </div>
            <div className="content">{item.text}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default ChatWindow;
