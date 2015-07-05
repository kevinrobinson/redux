import React from 'react';
import LoggitShell from './loggit/shell';
import 'todomvc-app-css/index.css';

// Entry point
const el = document.getElementById('root');
const loggitShell = new LoggitShell(el);
loggitShell.start();

// For debugging
window.loggitShell = loggitShell;