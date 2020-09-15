import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './store'; // Must be imported before hooks4redux implicitly creates a store
import 'resize-observer-polyfill';

import { Provider } from 'hooks-for-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';

const render = () => {
  ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
};

render();

// Hot reloading for testing of css/display changes
// May cause weirdness
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
