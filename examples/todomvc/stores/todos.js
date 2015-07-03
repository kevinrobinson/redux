import { ADD_TODO, DELETE_TODO, EDIT_TODO, MARK_TODO, MARK_ALL, CLEAR_MARKED } from '../constants/ActionTypes';

const initialTodos = [{
  text: 'Use Redux',
  marked: false,
  id: 0
}];

export default function todos(todos = initialTodos, action) {
  switch (action.type) {
  case ADD_TODO:
    return [{
      id: (todos.length === 0) ? 0 : todos[0].id + 1,
      marked: false,
      text: action.text
    }, ...todos];

  case DELETE_TODO:
    return todos.filter(todo =>
      todo.id !== action.id
    );

  case EDIT_TODO:
    return todos.map(todo =>
      todo.id === action.id ?
        { ...todo, text: action.text } :
        todo
    );

  case MARK_TODO:
    return todos.map(todo =>
      todo.id === action.id ?
        { ...todo, marked: !todo.marked } :
        todo
    );

  case MARK_ALL:
    const areAllMarked = todos.every(todo => todo.marked);
    return todos.map(todo => ({
      ...todo,
      marked: !areAllMarked
    }));

  case CLEAR_MARKED:
    return todos.filter(todo => todo.marked === false);

  default:
    return todos;
  }
}
