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

// This maps facts -> compaction key.  It's semantics are coupled
// to what facts mean and how they are used in the app.  This isn't
// library code.
export default function compactionKey(action) {
  switch (action.type) {
  case ADD_TODO:
    return [ADD_TODO, action.text];

  case DELETE_TODO:
    return [DELETE_TODO, action.id];

  case EDIT_TODO:
    return [EDIT_TODO, action.id];

  case UNCHECK_TODO:
    return [UNCHECK_TODO, action.id];

  case CHECK_TODO:
    return [CHECK_TODO, action.id];

  case CHECK_ALL:
    return [CHECK_ALL];

  case UNCHECK_ALL:
    return [UNCHECK_ALL];

  case CLEAR_MARKED:
    return [CLEAR_MARKED];

  default:
    return null;
  }
};