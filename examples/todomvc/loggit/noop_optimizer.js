// Just a placeholder
export default class NoopOptimizer {
  constructor(log, options = {}) {
    this.log = log;
    this._timeInCompute = 0;
    this._calls = 0;
  }

  logMsg(...params) {
    // this.logMsg(...params);
  }

  compute(computations) {
    this.logMsg('NoopOptimizer#compute:', computations);
    const before = performance.now();
    const computedValue = Object.keys(computations).reduce((slots, key) => {
      slots[key] = this.reduce(this.log, computations[key]);
      return slots;
    }, {});
    const after = performance.now();
    this._timeInCompute = this._timeInCompute + (after - before);
    this.logMsg('NoopOptimizer.timeInCompute:', this._timeInCompute);
    return computedValue;
  }

  reduce(log, computation) {
    this._calls++;
    this.logMsg('NoopOptimizer#reduce:', this._calls);
    return log.reduce(computation);
  }
}