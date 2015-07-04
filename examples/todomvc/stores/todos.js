import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  CHECK_TODO,
  UNCHECK_TODO,
  CHECK_ALL,
  UNCHECK_ALL,
  CLEAR_MARKED
} from '../actions/ActionTypes';

// Returns a 'computation' object.
export default {
  initial: [{
    text: 'Learn more',
    marked: false,
    id: 0
  }],

  reducer: function(todos, action) {
    switch (action.type) {
    // TODO(kr) This case of generating a unique id is trickier.
    // It really needs separate semantics, I think.
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

    case CHECK_TODO:
      return todos.map(todo =>
        todo.id === action.id ?
          { ...todo, marked: true } :
          todo
      );

    case UNCHECK_TODO:
      return todos.map(todo =>
        todo.id === action.id ?
          { ...todo, marked: false } :
          todo
      );

    case CHECK_ALL:
      return todos.map(todo => ({
        ...todo,
        marked: true
      }));

    case UNCHECK_ALL:
      return todos.map(todo => ({
        ...todo,
        marked: false
      }));

    case CLEAR_MARKED:
      return todos.filter(todo => todo.marked === false);

    default:
      return todos;
    }
  }
};