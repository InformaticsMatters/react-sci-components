import React from 'react';
import logo from './logo.svg';
import {ScatterPlot} from  './components/scatterplot/scatterplot';
import {Settings} from './components/settings/settings';
import './App.css';

function App() {
  return (
    <div className="App">
      <Settings/>
      <ScatterPlot/>
    </div>
  );
}

export default App;
