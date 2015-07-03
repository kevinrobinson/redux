import createDispatcher from './createDispatcher';
import composeStores from './utils/composeStores';
import thunkMiddleware from './middleware/thunk';


class Log {
  constructor() {
    this.facts = [];
  }

  recordFact(fact) {
    this.facts.push(fact);
    return undefined;
  }

  factsList() {
    return this.facts;
  }
}


export default class Redux {
  static create(...args) {
    return new Redux(...args);
  }

  constructor(dispatcherOrStores, initialState) {
    if (typeof dispatcherOrStores === 'object') {
      // A shortcut notation to use the default dispatcher
      finalDispatcher = createDispatcher(
        composeStores(dispatcherOrStores),
        (getState) => [thunkMiddleware(getState)]
      );
    }

    this.state = initialState;
    this.listeners = [];
    this.dispatcher = finalDispatcher;
    this.dispatchFn = finalDispatcher(this.state, ::this.setState);

    // this.replaceDispatcher(finalDispatcher);
  }

  // getDispatcher() {
  //   return this.dispatcher;
  // }

  // replaceDispatcher(nextDispatcher) {
  //   this.dispatcher = nextDispatcher;
  //   this.dispatchFn = nextDispatcher(this.state, ::this.setState);
  // }

  dispatch(action) {
    return this.dispatchFn(action);
  }

  getState() {
    return this.state;
  }

  setState(nextState) {
    this.state = nextState;
    this.listeners.forEach(listener => listener());
    return nextState;
  }

  subscribe(listener) {
    const { listeners } = this;
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // Returns the public API.
  api() {
    return {
      subscribe: ::this.subscribe,
      dispatch: ::this.dispatch,
      getState: ::this.getState
    };
  }
}
