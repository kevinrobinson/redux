// Maintains a cache of calls, for repeats calls to the same fn
// with the same set of facts.
//
// Methodology is hard reload, then check 'time in compute' for each optimizer
// on the console.  The data set is randomly generated though, so it's not
// a repeatable test, just ballpark.
//
// v1
// Quick and dirty profiling looks like this is a bit faster on the 3sec monkey
// test, from about ~950ms to ~750ms.  Logging looks like it's enough to affect
// performance here too.  Removing all logging means this is faster, from about
// ~1000ms to ~630ms.
//
// v2
// ?
export default class MemoizingOptimizer {
  constructor(log, options = {}) {
    this.log = log;

    // [fn, fn, fn]
    //   -> 
    // [{index: value}, {index: value}, {index: value}]
    this._cacheSize = options.cacheSize || 10;
    this._computations = Array(this._cacheSize);
    this._values = Array(this._cacheSize);
    this._nextCacheIndex = 0;

    this._hitCount = 0;
    this._missCount = 0;
    this._timeInCompute = 0;
  }

  logMsg(...params) {
    // console.log(...params);
  }

  compute(computations) {
    this.logMsg('MemoizingOptimizer#compute:', computations);
    const before = performance.now();
    const computedValue = Object.keys(computations).reduce((slots, key) => {
      slots[key] = this.reduce(this.log, computations[key]);
      return slots;
    }, {});
    const after = performance.now();
    this._timeInCompute = this._timeInCompute + (after - before);
    this.logMsg('MemoizingOptimizer.timeInCompute:', this._timeInCompute);
    return computedValue;
  }

  // This conflicts a bit with compaction, since if the length
  // changes we can get collisions.  With immutability, saving a reference
  // to 'facts' and checking that for equality would be better.
  reduce(log, computation) {
    const offset = log.facts.length;

    // read cache
    const computationIndex = this._computations.indexOf(computation);
    if (computationIndex !== -1) {
      var valuesByOffset = this._values[computationIndex];
      const cachedValue = valuesByOffset[offset];
      if (cachedValue !== undefined) {
        this._hitCount++;
        this.logMsg('MemoizingOptimizer#hit:', this._hitCount);
        return cachedValue;
      }
    }

    // compute
    this._missCount++;
    this.logMsg('MemoizingOptimizer#miss:', this._missCount);
    const computedValue = this.log.reduceComputation(computation);

    // write cache, existing computation
    if (computationIndex !== -1) {
      this.logMsg('MemoizingOptimizer#writing for existing computation:', computation, offset, computedValue);
      valuesByOffset[offset] = computedValue;
      return computedValue;
    }

    // new computation, may rollover bounds
    if (this._nextCacheIndex >= this._cacheSize) {
      this.logMsg('MemoizingOptimizer#rolling over');
      this._nextCacheIndex = 0;
    }
    
    this.logMsg('MemoizingOptimizer#writing for NEW computation', computation, offset, computedValue);
    this._computations[this._nextCacheIndex] = computation;
    this._values[this._nextCacheIndex] = _.extend({}, this._values[this._nextCacheIndex], { [offset]: computedValue });
    this._nextCacheIndex++;

    return computedValue;
  }
}