import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ChatWriter extends Component {

  constructor(props) {
    super(props);
    this.onEnter = this.onEnter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      text: ''
    };
  }

  onEnter(e) {
    if (e.key && e.key.toLowerCase() === 'enter') {
      this.props.onMessage(e.target.value)
        .then(() => this.setState({ text: '' }));
    }
  }

  onChange(e) {
    this.setState({ text: e.target.value }, () => {
      if (this.props.onType && this.state.text.length > 0) {
        this.props.onType();
      }
    });
  }

  render() {
    return (
      <div>
        <input
          className="input-writer"
          type="text"
          placeholder="Your message"
          value={this.state.text}
          onChange={this.onChange}
          onKeyPress={this.onEnter}
        />
      </div>
    );
  }
}

ChatWriter.propTypes = {
  onMessage: PropTypes.func.isRequired,
  onType: PropTypes.func
};
