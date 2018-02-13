import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import PropTypes from 'prop-types';
import '../index.css';

export default class ChatAction extends Component {

  constructor(props) {
    super(props);
    this.filterActions = this.filterActions.bind(this);
    this.state = {
      actions: [],
      interval: null
    }
  }

  componentDidMount() {
    this.state.interval = setInterval(() =>
      this.filterActions(this.props.actions), 2000);
  }

  componentWillReceiveProps(newProps) {
    const actions = newProps.actions;
    this.filterActions(actions);
  }

  filterActions(actions) {
    if (actions && actions.length > 0) {
      const userIds = [];
      const uniqueActions = [];
      for (let i = 0; i < actions.length; i++) {
        const userId = actions[i].user.id;
        const expired = moment(actions[i].creationDate).isBefore(moment().subtract(2, 's'));
        if (userIds.indexOf(userId) === -1 && !expired) {
          userIds.push(userId);
          uniqueActions.push(actions[i]);
        }
      }
      this.setState({ actions: uniqueActions });
    }
  }

  render() {
    if (this.state.actions.length > 0) {
      return (
        <div style={{textAlign: 'center'}}>
          {this.state.actions.map((action, index) => {
            return (
              <div key={index}>
                <span>{action.user.name} is typing...</span>
              </div>
            );
          })
        }
        </div>
      );
    }
    return null;
  }

}

ChatAction.propTypes = {
  actions: PropTypes.array.isRequired
};
