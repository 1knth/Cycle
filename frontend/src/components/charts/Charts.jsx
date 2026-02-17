import { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler, // for area fill
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const Charts = ({ type, dataValues }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    // 1. Create the Gradient
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0,200);
    // Top color: Green with 50% opacity
    // gradient.addColorStop(0, 'rgb(16, 185, 129)'); 
    gradient.addColorStop(0, 'rgb(160, 255, 197)'); 
    // Bottom color: White/Transparent
    gradient.addColorStop(1, 'rgba(124, 124, 124, 0)');

    setChartData({
      labels: dataValues.map(() => ''), // Empty labels
      datasets: [
        {
          label: 'Delta',
          data: dataValues,
          borderColor: '#10B981',
          borderWidth: 2,
          tension: 0.3, // Smooth curve
          fill: true,   // Fill the area
          backgroundColor: gradient, // The gradient we made above
          
          // 2. The "Arrow" Trick
          // Hide all points...
          pointRadius: (ctx) => {
            const index = ctx.dataIndex;
            const total = ctx.dataset.data.length;
            if (type === "plot") {
              return 4;
            }
            return 4; // Only show the last point
          },
          // Make the last point a triangle
          pointStyle: 'circle',
          pointBackgroundColor: '#0a7a55',
          // Rotate it to point up/down based on trend (optional, simplified here)
          rotation: 30, 
          hoverRadius: 10,
        },
      ],
    });
  }, [dataValues]);

  // 3. Clean Options (No Grid)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        display: false, // Hide X Axis labels & grid
      },
      y: {
        display: false, // Hide Y Axis labels & grid
        min: Math.min(...dataValues) - 5, // Add padding so the line doesn't hit bottom
      },
    },
    elements: {
      line: {
        borderCapStyle: 'round',
      },
    },
  };

  return (
    <div style={{ height: '100px', width: '100%' }}>
      <Line ref={chartRef} options={options} data={chartData} />
    </div>
  );
};

export default Charts;