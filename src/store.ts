// store.js

import { createStore, setStore } from 'hooks-for-redux';
import { applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware: Middleware[] = []; // Add new middleware here

let store;

if (process.env.NODE_ENV !== 'production') {
  store = setStore(createStore({}, composeWithDevTools(applyMiddleware(...middleware))));
}

export default store;
