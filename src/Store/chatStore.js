export const chatStore = {

  addMessage: message => {
    const messages = chatStore.getMessages();
    messages.push(message);
    localStorage.setItem('chat:messages', JSON.stringify(messages));
  },

  getMessages: () => {
    return JSON.parse(localStorage.getItem('chat:messages')) || [];
  },

  clear: () => {
    localStorage.removeItem('chat:messages');
  }

};
