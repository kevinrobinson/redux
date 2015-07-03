import { ADD_TODO, DELETE_TODO, EDIT_TODO, MARK_TODO, MARK_ALL, CLEAR_MARKED } from '../actions/ActionTypes';
import _ from 'lodash';

// Returns a 'computation' object.
export default class Compactor {
  constructor() {

  }

  compact(facts, keyFn) {

    return fact.reduce((compactedFacts, fact) => {

    }, {});
  }
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
  }
};