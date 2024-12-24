import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TicTacToe from './App';

// Import the service worker
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <TicTacToe />
  </React.StrictMode>,
  document.getElementById('root')
);

// Register the service worker
serviceWorkerRegistration.register({
  onUpdate: () => {
    alert('New version available! Update now?');
    if (confirm('New version available! Update now?')) {
      window.location.reload();
    }
  }
});