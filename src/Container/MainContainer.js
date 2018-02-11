import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import { ToastContainer, toast } from 'react-toastify';
import { userService } from '../Service/userService';
import Loader from '../Component/Loader';
import ApiException from '../Service/ApiException';
import ChatContainer from './ChatContainer';
import { chatStore } from '../Store/chatStore';

export default class MainContainer extends Component {

  static getUserLocalStorageKey() {
    return 'chat:user';
  }

  constructor(props) {
    super(props);
    this.onValidateName = this.onValidateName.bind(this);
    this.onSendingError = this.onSendingError.bind(this);
    this.onEnterName = this.onEnterName.bind(this);
    this.onLogout = this.onLogout.bind(this);

    this.state = {
      name: '',
      isLoading: false,
      user: null
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem(MainContainer.getUserLocalStorageKey()));
    if (user) {
      this.setState({ isLoading: true }, () => {
        userService.fetchUser(user.id, user.token)
          .then(user => {
            if (user.expirationDate && moment(user.expirationDate).isAfter(moment())) {
              this.setState({ user, isLoading: false });
            } else {
              throw new ApiException(null, 'unauthorized');
            }
          })
          .catch(err => {
            chatStore.clear();
            localStorage.removeItem(MainContainer.getUserLocalStorageKey());
            this.setState({ isLoading: false });
            const message = MainContainer.createMessage(err.getCode());
            toast.error(message, { position: toast.POSITION.TOP_RIGHT });
          });
      });
    }
  }

  onValidateName() {
    const name = this.state.name;
    if (name && name.length > 0) {
      this.setState({ isLoading: true }, () => {
        userService.createUser(name)
          .then(user => {
            localStorage.setItem(MainContainer.getUserLocalStorageKey(), JSON.stringify(user));
            this.setState({ user, isLoading: false });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            const message = MainContainer.createMessage(err.getCode());
            toast.error(message, { position: toast.POSITION.TOP_RIGHT });
          });
      });
    }
  }

  onLogout() {
    const user = JSON.parse(localStorage.getItem(MainContainer.getUserLocalStorageKey()));
    if (user) {
      localStorage.removeItem(MainContainer.getUserLocalStorageKey());
      localStorage.removeItem('chat:messages');
      this.setState({ isLoading: true }, () => {
        userService.removeUser(user.id, user.token)
          .then(() => this.setState({ user: null, isLoading: false }))
          .catch(err => {
            this.setState({ isLoading: false });
            const message = MainContainer.createMessage(err.getCode());
            toast.error(message, { position: toast.POSITION.TOP_RIGHT });
          });
        });
    }
  }

  onEnterName(e) {
    if (e.key && e.key.toLowerCase() === 'enter') {
      this.onValidateName();
      e.preventDefault();
    }
  }

  onSendingError(error) {
    let displayMessage = 'An unexpected error appeared. Please contact us.';
    if (error === 'unauthorized') {
      displayMessage = 'Your session has probably terminated.';
      this.setState({ user: null });
    }
    toast.error(displayMessage, { position: toast.POSITION.TOP_RIGHT });
  }

  static createMessage(code) {
    let displayMessage = 'An unexpected error appeared. Please contact us.';
    if (code === 'user.creation.duplicate') {
      displayMessage = 'Someone already took this name. Please choose another one.';
    } else if (code === 'user.creation.error') {
      displayMessage = 'An error appeared while creating new user. Please retry.';
    } else if (code === 'unauthorized') {
      displayMessage = 'Your chat session has expired.';
    } else if (code === 'network.error') {
      displayMessage = 'The chat database is no reachable yet.';
    }
    return displayMessage;
  }

  render() {
    let nameMarkup = null;
    let chatMarkup = null;
    let loaderMarkup = null;
    let footerMarkup = null;

    if (this.state.isLoading) {
      loaderMarkup = (
        <Loader />
      );
    }
    else if (!this.state.user) {
      nameMarkup = (
        <div className="name-entry">
          <ToastContainer autoClose={3000} />
          <p className="name-caption">Please enter your name to access room</p>
          <input
            onChange={e => this.state.name = e.target.value}
            type="text"
            placeholder="Your name"
            className="name-input"
            onKeyPress={this.onEnterName}
          />
          <button
            onClick={this.onValidateName}
            className="name-button">
              Enter
          </button>
        </div>
      );
    }
    else {
      footerMarkup = (
        <footer>
          <a onClick={this.onLogout}>Logout</a>
        </footer>
      );
      chatMarkup = (
        <div>
          <ChatContainer
            user={this.state.user}
            onSendingError={this.onSendingError}
          />
        </div>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Chat4Biz</h1>
        </header>
        {nameMarkup}
        {loaderMarkup}
        {chatMarkup}
        {footerMarkup}
      </div>
    );
  }
}
