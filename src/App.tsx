import React from 'react';
import './App.css';
import useAsync from './hooks/use-async';
import { loadData } from './api';
import PricingTable from './PricingTable';

function App() {
  const { loading, error, result } = useAsync(loadData);

  return (
    <div className="App">
      {loading && <h3>Loading</h3>}
      {error && <h3>Error {error}</h3>}
      {result && <PricingTable data={result} />}
    </div>
  );
}

export default App;
