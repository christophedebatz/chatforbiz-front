import React from 'react';
import ReactDOM from 'react-dom';
import ChatContainer from '../Container/ChatContainer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
