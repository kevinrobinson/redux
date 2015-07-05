import React from 'react';
import TodoApp from '../components/TodoApp';


// Batches with RAF, no shouldComponentUpdate optimizations.
export default class RafReactRenderer {
  constructor(el, loggit) {
    this.el = el;
    this.loggit = loggit;
    this._loop = this._loop.bind(this);
  }

  start() {
    this._wasDestroyed = false;
    this._isDirty = true;
    this._renderCount = 0;
    this._loop();
  }

  notify() {
    this._isDirty = true;
  }

  destroy() {
    this._wasDestroyed = true;
    return undefined;
  }

  _loop() {
    if (this._wasDestroyed) return;
    if (this._isDirty) {
      this._renderCount++;
      console.log('RafReactRenderer#render', this._renderCount);
      this._render();
      this._isDirty = false;
    }

    window.requestAnimationFrame(this._loop);
  }

  _render() {
    React.render(
      <TodoApp loggit={this.loggit} />,
      this.el
    );
  }
}