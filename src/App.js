import React from 'react';
import {ScatterPlot} from  './components/scatterplot/scatterplot';
import {Settings} from './components/settings/settings';
import './App.css';
import CardView from 'components/cardView/CardView';

function App() {
  return (
    <div className="App">
      <Settings/>
      <ScatterPlot/>
      <CardView />
    </div>
  );
}

export default App;
