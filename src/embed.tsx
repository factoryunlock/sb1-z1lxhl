import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import PieChart from './components/PieChart';
import { tokenData } from './data/tokenData';
import './index.css';

// Create a function to initialize the chart
function initTokenChart(elementId: string) {
  const container = document.getElementById(elementId);
  if (!container) return;
  
  createRoot(container).render(
    <StrictMode>
      <div className="bg-gray-950 p-8 rounded-lg">
        <PieChart data={tokenData} />
      </div>
    </StrictMode>
  );
}

// Make it available globally
(window as any).initTokenChart = initTokenChart;