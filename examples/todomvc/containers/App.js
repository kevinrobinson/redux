import React from 'react';
import Log from '../lib/log';
import Optimizer from '../lib/optimizer';
import TodoApp from './TodoApp';


// Outermost layer
export default class App extends React.Component {
  componentWillMount() {
    const log = this.log = new Log({ onFact: this.onFact.bind(this) });
    const optimizer = this.optimizer = new Optimizer(log);
    this.loggit = {
      recordFact: log.recordFact.bind(log),
      reduce: log.reduce.bind(log),
      compute: optimizer.compute.bind(optimizer)
    }
  }

  // Starting super naive.
  onFact(log, fact) {
    console.log('fact', fact);
    this.forceUpdate();
  }

  render() {
    return <TodoApp loggit={this.loggit} />;
  }
}
