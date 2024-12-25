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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('ServiceWorker registered: ', registration);
      },
      (error) => {
        console.log('ServiceWorker registration failed: ', error);
      }
    );
  });
}
