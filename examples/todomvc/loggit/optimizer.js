// Just a placeholder
export default class Optimizer {
  constructor(log) {
    this.log = log;
  }

  compute(computations) {
    console.log('Optimizer#compute:', computations);
    return Object.keys(computations).reduce((slots, key) => {
      slots[key] = this.log.reduce(computations[key]);
      return slots;
    }, {});
  }
}