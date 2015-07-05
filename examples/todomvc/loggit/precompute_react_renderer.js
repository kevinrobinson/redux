import React from 'react';
import TodoApp from '../components/TodoApp';
import _ from 'lodash';

// reaching into React's internals here
const ReactInterpreter = {
  nodeId: (component) => {
    return component._reactInternalInstance._rootNodeID;
  },

  childComponents: (component) => {
    // Not sure what this wrapping is about, seems dicey
    const renderedComponent = component._reactInternalInstance._renderedComponent._renderedComponent || component._reactInternalInstance._renderedComponent;    
    if (!renderedComponent) {
      console.warn(component);
    }
    const renderedChildren = renderedComponent._renderedChildren || {};
    if (!renderedChildren) {
      console.warn(component);
    }

    // some internal DOM components (eg, ReactDOMTextComponent) don't have
    // this property, since we're at the bottom layer bridging to the native
    // system
    return _.compact(_.pluck(_.values(renderedChildren), '_instance'));
  },

  // part of the loggit API
  computations: (component) => {
    return (component.computations) ? component.computations() : {};
  }
};

// This batches with RAF, but also precomputes values for `compute`
// before calling `render` in the next animation frame.
// This way we can split the computation to another thread, and guaranteed its
// all been memoized before synchronously calling render.
// The idea is we write the computation we want performed in components, then
// that can be precomputed before render, so that the hot path in render can stay
// synchronous and fast.
export default class PrecomputeReactRenderer {
  constructor(el, loggit, options = {}) {
    this.options = options;
    this.el = el;
    this.loggit = loggit;
    this.optimizer = options.optimizer;

    this._loop = this._loop.bind(this);
    this._lastCompute = {};
    this._rootComponent = null;    
  }

  logMsg(...params) {
    // console.log(...params);
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
    // this._rootComponent = null;
    this._wasDestroyed = true;
    return undefined;
  }

  _loop() {
    if (this._wasDestroyed) return;
    if (this._isDirty) {
      this._renderCount++;
      this._render();
      this._isDirty = false;
    }

    window.requestAnimationFrame(this._loop);
  }

  // additional API for optimizer/renderer cooperation
  // we're trying to improve over naive top-down rendering
  notifyAboutCompute(component, computations, computedValues) {
    const reactNodeId = ReactInterpreter.nodeId(component);
    this.logMsg('PrecomputeReactRenderer#notifyAboutCompute', reactNodeId, computedValues);
    this._lastCompute[reactNodeId] = {computedValues}
  }


  // instead of top-down rendering, we'll walk the tree ourselves, calling
  // render as we need to when a copmutedValue has changed, only in order to
  // discover lower branches of the tree.
  _render() {
    this.logMsg('PrecomputeReactRenderer#render', this._renderCount);
    if (!this._rootComponent) {
      return this._initialRender();
    }

    // discover what parts of the tree need to be rendered.
    const dirtyComponents = this._findDirtyComponents(this._rootComponent);
    console.info('dirtyComponents:', dirtyComponents);

    // do something about it to update components.
    // could use heuristics here to batch further.
    // we could also optimize this if child components under a 'dirty' component
    // end up computing the same data for their component.  that's an additional
    // step, where we essentially want to short-circuit like `shouldComponentUpdate`.
    // could work by setState into each component, might be straightforward.
    dirtyComponents.forEach((dirtyComponent) => {
      this.logMsg('forceUpdate', dirtyComponent);
      dirtyComponent.forceUpdate();
    });
  }

  // This is important since it also collects the 
  // information about compute for optimizing in 
  // subsequent passes.
  _initialRender() {
    this._rootComponent = React.render(
      <TodoApp loggit={this.loggit} />,
      this.el
    );
  }

  // Computes and checks whether value changed and we should render.
  _shouldRender(component) {
    const reactNodeId = ReactInterpreter.nodeId(component);
    const lastCompute = this._lastCompute[reactNodeId];
    const computations = ReactInterpreter.computations(component);
    this.logMsg('computations:', computations);
    if (_.isEmpty(computations)) {
      return false;
    }

    // immutability would help here
    const prevComputedValues = lastCompute.computedValues || {};
    const nextComputedValues = this.optimizer.compute(computations);
    this.logMsg('prev:', prevComputedValues, 'next:', nextComputedValues);
    const shouldRender = !_.isEqual(prevComputedValues, nextComputedValues);
    this.logMsg('shouldRender:', shouldRender);
    return shouldRender;
  }

    // this is a little slipperty, using the loggit seam to make calls
    // to the optimizer that aren't tracked.
  _findDirtyComponents(component) {
    const reactNodeId = ReactInterpreter.nodeId(component);
    this.logMsg('PrecomputeReactRenderer#_findDirtyComponents', reactNodeId);

    // don't have to render that component if none of its data
    // has changed.  but we do have to keep walking the tree since
    // child components might compute something different (ie, it's not
    // really top-down at all anymore).
    const shouldRender = this._shouldRender(component);
    if (shouldRender) {
      // we need to render the rest of the tree under this component, since
      // its data has changed and we can't know the effects on the react component
      // tree.  this is where the strength of writing plain code in `render` hurts,
      // since we can inspect further inside that function to do any optimizations.
      //
      // return this node and everythign under it as dirty.
      this.logMsg('PrecomputeReactRenderer.shouldRender', reactNodeId);
      return [component];
    }

    // we don't need to render this node, it's all set, so the next step
    // is to descend into its children.  this reaches into react internals,
    // so those bits are factored out into ReactInterpreter.
    // this recurs through the tree.
    const childComponents = ReactInterpreter.childComponents(component);
    return _.flatten(childComponents.map((childComponent) => {
      return this._findDirtyComponents(childComponent);
    }));
  }
}