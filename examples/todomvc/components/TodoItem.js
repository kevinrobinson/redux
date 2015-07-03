import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';
import * as TodoActions from '../actions/TodoActions';

export default class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.object.isRequired,
    loggit: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  handleDoubleClick() {
    this.setState({ editing: true });
  }

  handleMarkTodo() {
    const {todo} = this.props;
    this.props.loggit.recordFact(TodoActions.markTodo(todo.id));
  }

  handleDestroyTodo() {
    const {todo} = this.props;
    this.props.loggit.recordFact(TodoActions.deleteTodo(todo.id));
  }

  // TODO(kr) Make this just record, interpet later?
  handleSave(id, text) {
    if (text.length === 0) {
      this.props.loggit.recordFact(TodoActions.deleteTodo(id));
    } else {
      this.props.loggit.recordFact(TodoActions.editTodo(id, text));
    }
    this.setState({ editing: false });
  }

  render() {
    const {todo} = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      );
    } else {
      element = (
        <div className='view'>
          <input className='toggle'
                 type='checkbox'
                 checked={todo.marked}
                 onChange={this.handleMarkTodo.bind(this)} />
          <label onDoubleClick={this.handleDoubleClick.bind(this)}>
            {todo.text}
          </label>
          <button className='destroy'
                  onClick={this.handleDestroyTodo.bind(this)} />
        </div>
      );
    }

    return (
      <li className={classnames({
        completed: todo.marked,
        editing: this.state.editing
      })}>
        {element}
      </li>
    );
  }
}
