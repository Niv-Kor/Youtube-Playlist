import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Reducers from './store/reducers/index';
import Logger from 'redux-logger';
import Thunk from 'redux-thunk'
import PromiseMiddleware from 'redux-promise-middleware';

const store = createStore(Reducers, {}, applyMiddleware(Logger, Thunk, PromiseMiddleware));

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
