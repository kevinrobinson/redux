import Log from './log';
import Optimizer from './optimizer';
import NaiveReactRenderer from './naive_react_renderer';
import RafReactRenderer from './raf_react_renderer';
import Compactor from './compactor';
import compactionFn from '../stores/compaction_fn'


// Outermost layer
export default class Shell {
  constructor(el) {
    this.el = el;
    this.log = new Log({ onFact: this._onFact.bind(this) });
    this.optimizer = new Optimizer(this.log);
    this.loggit = this._createLoggitApi(this.log, this.optimizer);    
    this.renderer = new RafReactRenderer(this.el, this.loggit);
  }

  // public
  start() {
    this.renderer.start();
    this._notifyRenderer();
    return undefined;
  }

  // public
  destroy() {
    this.renderer.destroy();
    return undefined;
  }

  // API that React components see, letting them
  // recording facts about user actions and ask for
  // computations on the log
  _createLoggitApi(log, optimizer) {
    return {
      recordFact: log.recordFact.bind(log),
      compute: optimizer.compute.bind(optimizer),
      experimental: {
        forceCompaction: this._experimentalCompaction.bind(this)
      }
    };
  }

  _onFact() {
    this._notifyRenderer();  
  }

  // This inform the renderer that something has occurred.
  // It can decide whether to respond synchronously, or to 
  // batch, etc.
  _notifyRenderer() {
    this.renderer.notify();
  }

  // Just hacking to see the effects here
  _experimentalCompaction() {
    const compactor = new Compactor();
    const previousSize = this.log.facts.length;
    this.log.facts = compactor.compacted(this.log.facts, compactionFn);

    const compactionSize = previousSize - this.log.facts.length;
    const percentText = Math.round(100 * (compactionSize / previousSize)) + '%';
    console.log('compaction freed: ', compactionSize, percentText);

    this._notifyRenderer();
  }
}
