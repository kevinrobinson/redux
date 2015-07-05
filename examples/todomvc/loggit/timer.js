// For timing blocks of code
export default class Timer {
  constructor(timerName, options = {}) {
    this.timerName = timerName;
    this.options = options;
    this.totalTime = 0;
  }

  time(fn) {
    const before = window.performance.now();
    const returnValue = fn();
    const after = window.performance.now();
    const elapsedTime = after - before;
    this.totalTime = this.totalTime + elapsedTime;
    this.logMsg(this.timerName, 'elapsedTime:', elapsedTime, 'totalTime:', this.totalTime);
    return returnValue;
  }

  logMsg(...params) {
    (this.options.logFn || console.log.bind(console))(...params);
  }
}
