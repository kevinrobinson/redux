// code for pulling out profiling data and reporting it
export default class ProfilingReporter {
  constructor(renderTimer, computeTimer) {
    this.renderTimer = renderTimer;
    this.computeTimer = computeTimer;
  }

  printStats() {
    const {renderTimer, computeTimer} = this;
    return [
      'r:',
      Math.round(renderTimer.totalTime),
      renderTimer.calls,
      this.timePerCall(renderTimer),
      'c:',
      Math.round(computeTimer.totalTime),
      computeTimer.calls,
      this.timePerCall(computeTimer),
      '|',
      'redux'
    ];
  }

  timePerCall(timer) {
    return parseFloat((timer.totalTime / timer.calls).toFixed(4));
  }
}
