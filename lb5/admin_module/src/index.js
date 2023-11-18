import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";




const defaultState =
    {
        listTrading:[]
    };

const reducer = (state = defaultState, action)=>{
    switch (action.type) {
        case "SAVE":
            return {...state, listTrading: action.listTrading}
        default:
            return state
    }
}
const store = createStore(reducer)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App/>
         
      </Provider>


  </React.StrictMode>
);
reportWebVitals();