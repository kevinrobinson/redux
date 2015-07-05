import RenderTimer from './render_timer';

// Just a placeholder with profiling, does no actual optimizations.
export default class NoopOptimizer {
  constructor(log, options = {}) {
    this.log = log;
    this._timeInCompute = 0;
    this._calls = 0;
    
    this._renderTimer = new RenderTimer('NoopOptimizer', {
      logFn: this.logMsg.bind(this)
    });
  }

  logMsg(...params) {
    // console.log(...params);
  }

  compute(computations) {
    return this._renderTimer.time(() => {
      return Object.keys(computations).reduce((slots, key) => {
        slots[key] = this.reduce(this.log, computations[key]);
        return slots;
      }, {});
    });
  }

  reduce(log, computation) {
    this._calls++;
    this.logMsg('NoopOptimizer#reduce:', this._calls);
    return log.reduceComputation(computation);
  }
}