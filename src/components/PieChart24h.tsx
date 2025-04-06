import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type SiteData = {
  site: string;
  timeSpent: number; // in seconds
};

const PieChart24h: React.FC = () => {
  const [data, setData] = useState<SiteData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/usage/last24h/Mukul'); // Change username if needed
        setData(res.data);
      } catch (err) {
        console.error('Error fetching usage data:', err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map(item => item.site),
    datasets: [
      {
        label: 'Time Spent (in minutes)',
        data: data.map(item => (item.timeSpent / 60).toFixed(2)), // convert seconds to minutes
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#C9CBCF', '#33FF57',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <h2>🕓 Most Used Websites (Last 24 Hours)</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart24h;