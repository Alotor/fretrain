import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { enableMapSet } from "immer";

enableMapSet();

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
