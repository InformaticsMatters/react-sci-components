// store.js

import { createStore, setStore } from 'hooks-for-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

let store;

if (process.env.NODE_ENV !== 'production') {
  store = setStore(createStore({}, devToolsEnhancer({})));
}

export default store;
