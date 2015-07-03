// Core
// import createRedux from './createRedux';
import Redux from './Redux';

const createRedux = Redux.create;
import createDispatcher from './createDispatcher';

// Utilities
import composeMiddleware from './utils/composeMiddleware';
import composeStores from './utils/composeStores';
import bindActionCreators from './utils/bindActionCreators';

import { PropTypes } from 'react';
const ReduxPropType = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

export {
  createRedux,
  createDispatcher,
  composeMiddleware,
  composeStores,
  bindActionCreators,
  ReduxPropType
};
