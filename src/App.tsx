import React from 'react';
import PieChart from './components/PieChart';
import { tokenData } from './data/tokenData';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Token Distribution</h1>
        <PieChart data={tokenData} />
      </div>
    </div>
  );
}

export default App;