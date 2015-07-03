import React, { PropTypes } from 'react';
import TodoTextInput from './TodoTextInput';
import * as TodoActions from '../actions/TodoActions';

export default class Header {
  static propTypes = {
    loggit: PropTypes.object.isRequired
  };

  handleSave(text) {
    if (text.length === 0) return;
    const userAddedTodo = TodoActions.addTodo(text);
    this.props.loggit.recordFact(userAddedTodo);
  }

  render() {
    return (
      <header className='header'>
          <h1>todos</h1>
          <TodoTextInput newTodo={true}
                         onSave={::this.handleSave}
                         placeholder='What needs to be done?' />
      </header>
    );
  }
}
