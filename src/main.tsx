import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//lib css
import './assets/index.css'
import '@milon27/react-modal/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';
import '@milon27/react-sidebar/dist/react-sidebar.css'


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
