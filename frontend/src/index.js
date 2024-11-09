import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ReactModal from 'react-modal';
import App from './App';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
ReactModal.setAppElement('#root'); 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="dark"
      transition={Bounce}
      />
    </>
);
