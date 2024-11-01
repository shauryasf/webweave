import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReactModal from 'react-modal';
import App from './App';
ReactModal.setAppElement('#root'); 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
