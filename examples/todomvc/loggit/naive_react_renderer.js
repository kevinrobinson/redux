import React from 'react';
import TodoApp from '../components/TodoApp';


// Starting super naive, no shouldComponentUpdate or any
// optimization.
export default class NaiveReactRenderer {
  constructor(el, loggit) {
    this.el = el;
    this.loggit = loggit;
    this._renderCount = 0;
  }

  start() {
    return undefined;
  }

  destroy() {
    return undefined;
  }

  notify() {
    this._render();
  }

  _render() {
    this._renderCount++;
    console.log('NaiveReactRenderer#render', this._renderCount);
    React.render(
      <TodoApp loggit={this.loggit} />,
      this.el
    );
    return undefined;
  }
}