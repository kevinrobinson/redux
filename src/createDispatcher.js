import composeMiddleware from './utils/composeMiddleware';
import Timer from './utils/Timer';

const INIT_ACTION = {
  type: '@@INIT'
};

export default function createDispatcher(store, middlewares = []) {
  return function dispatcher(initialState, setState) {
    let state = setState(store(initialState, INIT_ACTION));
    const computeTimer = new Timer('compute');
    const renderTimer = new Timer('render');

    function dispatch(action) {
      // compute
      const newState = computeTimer.time(() => store(state, action));

      // render
      renderTimer.time(() => state = setState(newState));

      return action;
    }

    function getState() {
      return state;
    }

    const finalMiddlewares = typeof middlewares === 'function' ?
      middlewares(getState) :
      middlewares;

    let wrappedDispatchFn = composeMiddleware(...finalMiddlewares, dispatch);
    wrappedDispatchFn.timers = {computeTimer, renderTimer};
    return wrappedDispatchFn;
  };
}
