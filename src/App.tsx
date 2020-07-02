import './App.css';

import React from 'react';

import CardView from './components/cardView/CardView';
import ScatterPlot from './components/scatterplot/Scatterplot';
import Settings from './components/settings/Settings';

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
