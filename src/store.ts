// store.js

import { createStore, setStore } from 'hooks-for-redux';
import { applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const serialisedState = localStorage.getItem('state');
const preloadedState = serialisedState ? JSON.parse(serialisedState) : undefined;
localStorage.removeItem('state');

const middleware: Middleware[] = []; // Add new middleware here

let store;

if (process.env.NODE_ENV !== 'production') {
  store = setStore(
    createStore({}, preloadedState, composeWithDevTools(applyMiddleware(...middleware))),
  );
}

export default store;
