import React from 'react';
import LoggitShell from './lib/loggit_shell';
import 'todomvc-app-css/index.css';

const el = document.getElementById('root');
const loggitShell = new LoggitShell();
loggitShell.start(el);