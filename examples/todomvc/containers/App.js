import React, { Component } from 'react';
import Log from '../lib/log';
import TodoApp from './TodoApp';
// import { createRedux, ReduxPropType } from 'redux';
// import { Provider } from 'redux/react';
// import * as stores from '../stores';



// Redux must have final references
// class ReduxProvider extends Component {
//   static propTypes = {
//     redux: ReduxPropType.isRequired
//   }

//   static childContextTypes = {
//     redux: ReduxPropType.isRequired
//   }

//   constructor(props, context) {
//     super(props, context);
//   }

//   getChildContext() {
//     return { redux: this.props.redux };
//   }

//   render() {
//     return this.props.children;
//   }
// }


// Outermost layer
export default class App {
  componentDidMount() {
    this.log = new Log();
    this.loggit = {
      recordFact: ::log.recordFact
      reduce: ::log.reduce
    }
  }

  render() {
    return <TodoApp loggit={this.loggit} />;
  }
}
