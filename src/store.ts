// store.js

import { createStore, setStore } from 'hooks-for-redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

export default setStore(createStore({}, devToolsEnhancer({})));
