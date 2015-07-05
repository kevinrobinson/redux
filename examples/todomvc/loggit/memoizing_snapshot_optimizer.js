// Maintains a cache of calls, for repeats calls to the same fn
// with the same set of facts.
//
// Profiling methodology is to do a hard reload, then check 'time in compute'
// for each optimizer on the console.  The data set is randomly generated though, so
// it's not a repeatable test, just ballpark.  Logging seems to affect these
// numbers quite a bit, so there's a test that removes them.
//

const VALUE_NOT_FOUND = '@@loggit:VALUE_NOT_FOUND:loggit@@';

export default class MemoizingSnapshotOptimizer {
  constructor(log, options = {}) {
    this.log = log;

    // {[fn,offset] -> value}
    this._cacheSize = options.cacheSize || 10;
    this._keys = Array(this._cacheSize);
    this._values = Array(this._cacheSize);
    this._heat = Array(this._cacheSize);
    this._nextCacheIndex = 0;

    // not bounded yet
    this._snapshotCache = {};

    this._hitCount = 0;
    this._missCount = 0;
    this._timeInCompute = 0;
  }

  logMsg(...params) {
    // console.log(...params);
  }

  compute(computations) {
    this.logMsg('MemoizingSnapshotOptimizer#compute:', computations);
    const before = performance.now();
    const computedValue = Object.keys(computations).reduce((slots, key) => {
      slots[key] = this.reduce(this.log, computations[key]);
      return slots;
    }, {});
    const after = performance.now();
    this._timeInCompute = this._timeInCompute + (after - before);
    this.logMsg('MemoizingSnapshotOptimizer.timeInCompute:', this._timeInCompute);
    return computedValue;
  }

  memoizationCacheKey(log, computation) {
    return [
      JSON.stringify(computation.initial),
      computation.reducer,
      log.facts.length
    ].join('@loggit@');
  }

  readMemoizationCache(cacheKey) {
    const index = this._keys.indexOf(cacheKey);
    return (index === -1)
      ? VALUE_NOT_FOUND
      : this._values[index];
  }

  writeToMemoizationCache(cacheKey, computedValue) {
    // new key, may rollover bounds
    if (this._nextCacheIndex >= this._cacheSize) {
      this.logMsg('MemoizingSnapshotOptimizer#rolling over');
      this._nextCacheIndex = 0;
    }
    
    // write to memoization cache
    this.logMsg('MemoizingSnapshotOptimizer#writing for new key', cacheKey, computedValue);
    this._keys[this._nextCacheIndex] = cacheKey;
    this._values[this._nextCacheIndex] = computedValue;
    this._nextCacheIndex++;

    return undefined;
  }

  snapshotCacheKey(computation) {
    return [
      JSON.stringify(computation.initial),
      computation.reducer
    ].join('@loggit@');
  }

  readSnapshotCache(cacheKey) {
    const snapshot = this._snapshotCache[cacheKey];
    return (snapshot === undefined)
      ? VALUE_NOT_FOUND
      : snapshot;
  }

  // Requires reaching into the log to slice the facts,
  // and also makes assumptions about length always growing.
  // Could swap this around to find an offset.
  computeFromSnapshot(log, computation, snapshot) {
    const slice = this.log.facts.slice(snapshot.index);
    return slice.reduce(computation.reducer, snapshot.computedValue);
  }

  writeToSnapshotCache(snapshotCacheKey, log, computedValue) {
    this._snapshotCache[snapshotCacheKey] = {
      index: log.facts.length,
      computedValue
    };
    return undefined;
  }

  // This conflicts a bit with compaction, since if the log length
  // changes we can get collisions.  With immutability, saving a reference
  // to 'facts' and checking that for equality would be better.
  reduce(log, computation) {
    // check memoization cache
    const memoizationCacheKey = this.memoizationCacheKey(log, computation);
    const memoizedValue = this.readMemoizationCache(memoizationCacheKey);
    if (memoizedValue !== VALUE_NOT_FOUND) {
      this._hitCount++;
      this.logMsg('MemoizingSnapshotOptimizer#memoizationHit:', this._hitCount);
      return memoizedValue;
    }

    // check for snapshot to start from
    const snapshotCacheKey = this.snapshotCacheKey(computation);
    const snapshot = this.readSnapshotCache(snapshotCacheKey);
    if (snapshot !== VALUE_NOT_FOUND) {
      this._hitCount++;
      this.logMsg('MemoizingSnapshotOptimizer#snapshotHit:', this._hitCount);
      return this.computeFromSnapshot(log, computation, snapshot);
    }

    // compute
    this._missCount++;
    this.logMsg('MemoizingSnapshotOptimizer#miss:', this._missCount);
    const computedValue = this.log.reduceComputation(computation);

    // write to caches
    this.writeToMemoizationCache(memoizationCacheKey, computedValue);
    this.writeToSnapshotCache(snapshotCacheKey, log, computedValue);

    return computedValue;
  }
}
