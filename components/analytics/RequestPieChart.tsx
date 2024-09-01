import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const RequestPieChart = ({
  status
}: {
  status: { status: string; count: number }[];
}) => {
  let valid = 0;
  let invalid = 0;
  for (let i = 0; i < status.length; i++) {
    if (status[i].status === 'approved') {
      valid = status[i].count;
    } else if (status[i].status === 'rejected') {
      invalid = status[i].count;
    }
  }

  const data = [
    {
      values: [valid, invalid],
      labels: ['Valid Requests', 'Invalid Requests'],
      type: 'pie',
      textinfo: 'label+percent', // Show both label and percentage
      textposition: 'inside', // Position text inside the slices
      marker: {
        colors: ['#2ca02c', '#d62728'], // Custom colors for valid and invalid requests
        line: {
          color: '#ffffff', // White border for slices
          width: 2
        }
      },
      hole: 0.4 // Makes it a donut chart for a more modern look
    }
  ];

  const layout = {
    title: {
      text: 'Valid vs Invalid Requests',
      font: {
        family: 'Arial, sans-serif',
        size: 24,
        color: '#333'
      }
    },
    showlegend: true,
    legend: {
      x: 1,
      y: 0.5,
      bgcolor: '#f9f9f9',
      bordercolor: '#e9e9e9',
      borderwidth: 1,
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#333'
      }
    },
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 70
    },
    plot_bgcolor: '#f4f4f4', // Background color for the plot area
    paper_bgcolor: '#ffffff' // Background color for the overall chart
  };

  //@ts-ignore
  return <Plot data={data} layout={layout} />;
};

export default RequestPieChart;
