import React from 'react';
import TodoApp from '../components/TodoApp';


// Starting super naive, no shouldComponentUpdate or any
// optimization.
export default class NaiveReactRenderer {
  constructor(el, loggit) {
    this.el = el;
    this.loggit = loggit;
  }


  //public
  render() {
    console.log('NaiveReactRenderer#render');
    React.render(
      <TodoApp loggit={this.loggit} />,
      this.el
    );
    return undefined;
  }

  //public 
  destroy() {
    return undefined;
  }
}