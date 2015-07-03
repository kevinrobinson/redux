import React, { PropTypes } from 'react';
import TodoTextInput from './TodoTextInput';
import TodoActions from '../actions/TodoActions';

export default class Header {
  static propTypes = {
    recordFact: PropTypes.func.isRequired
  };

  handleSave(text) {
    if (text.length === 0) return;
    const fact = TodoActions.addTodo(text);
    this.props.recordFact(fact);
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
