import React from 'react';
import LoggitShell from './loggit/shell';
import 'todomvc-app-css/index.css';
import initialFacts from './test/initial_facts_set1';

// Entry point
const el = document.getElementById('root');
const loggitShell = new LoggitShell(el, {initialFacts});
loggitShell.start();

// For debugging
window.React = React;
window.loggitShell = loggitShell;
window.optimizerStats = () => {
  const calls = (loggitShell.optimizer._hitCount + loggitShell.optimizer._missCount);
  const percentHits = Math.round(100 * loggitShell.optimizer._hitCount / calls);
  return [
    percentHits,
    calls,
    Math.round(loggitShell.optimizer._renderTimer.totalTime),
    loggitShell.optimizer
  ];
}