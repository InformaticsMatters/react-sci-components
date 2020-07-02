import './App.css';

import React from 'react';

import CardView from './components/cardView/CardView';
import ScatterPlot from './components/scatterplot/scatterplot';
import Settings from './components/settings/settings';

function App() {
  return (
    <div className="App">
      <Settings />
      <ScatterPlot />
      <CardView />
    </div>
  );
}

export default App;
