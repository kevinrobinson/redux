import { ADD_TODO, DELETE_TODO, EDIT_TODO, MARK_TODO, MARK_ALL, CLEAR_MARKED } from '../actions/ActionTypes';

// Returns a 'computation' object.
export default function compactionKey(action) {
  switch (action.type) {
  case ADD_TODO:
    return [ADD_TODO, action.text];

  case DELETE_TODO:
    return [DELETE_TODO, action.id];

  case EDIT_TODO:
    return [EDIT_TODO, action.id];

  case MARK_TODO:
    return [MARK_TODO, action.id];

  case MARK_ALL:
  return [MARK_ALL];

  case CLEAR_MARKED:
    return [CLEAR_MARKED];

  default:
    return null;
  }
};