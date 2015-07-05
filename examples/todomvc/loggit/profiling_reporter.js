// code for pulling out profiling data and reporting it
export default class ProfilingReporter {
  constructor(loggitShell) {
    this.loggitShell = loggitShell;
  }

  printStats() {
    const calls = (loggitShell.optimizer._hitCount + loggitShell.optimizer._missCount);
    const percentHits = Math.round(100 * loggitShell.optimizer._hitCount / calls);
    return [
      isNaN(percentHits) ? 0 : percentHits,
      isNaN(calls) ? 0 : calls,
      Math.round(loggitShell.optimizer.timer.totalTime),
      loggitShell.optimizer
    ];
  }
}