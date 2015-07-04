import * as types from './ActionTypes';

export function addTodo(text) {
  return {
    type: types.ADD_TODO,
    text
  };
}

export function deleteTodo(id) {
  return {
    type: types.DELETE_TODO,
    id
  };
}

export function editTodo(id, text) {
  return {
    type: types.EDIT_TODO,
    id,
    text
  };
}

export function checkTodo(id) {
  return {
    type: types.CHECK_TODO,
    id
  };
}

export function uncheckTodo(id) {
  return {
    type: types.UNCHECK_TODO,
    id
  };
}

export function checkAll() {
  return {
    type: types.CHECK_ALL
  };
}

export function uncheckAll() {
  return {
    type: types.UNCHECK_ALL
  };
}

export function clearMarked() {
  return {
    type: types.CLEAR_MARKED
  };
}
