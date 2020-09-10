// store.js

import { createStore, setStore } from 'hooks-for-redux';
import { Middleware } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

const middleware: Middleware[] = []; // Add new middleware here

let store;

if (process.env.NODE_ENV !== 'production') {
  store = setStore(createStore({}, devToolsEnhancer({})));
}

export default store;
