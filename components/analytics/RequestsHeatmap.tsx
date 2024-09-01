'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const RequestsHeatmap = ({
  concatCentStatus
}: {
  concatCentStatus: {
    assignedCenter: string;
    status: string;
    count: number;
  }[];
}) => {
  let Z = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  for (let i = 0; i < concatCentStatus.length; i++) {
    let number = +concatCentStatus[i].assignedCenter.split('-')[1];
    let status = concatCentStatus[i].status;
    let statusNumber = 0;
    if (status === 'approved') {
      statusNumber = 1;
    } else if (status === 'rejected') {
      statusNumber = 2;
    }
    let count = concatCentStatus[i].count;
    Z[statusNumber][number - 1] = count;
  }
  const data = [
    {
      z: Z,
      x: ['New Delhi-1', 'New Delhi-2', 'New Delhi-3'],
      y: ['Approved', 'Rejected', 'Pending'],
      type: 'heatmap',
      colorscale: 'Viridis', // Use a color scale for better visual representation
      showscale: true // Display the color scale
    }
  ];

  const layout = {
    title: {
      text: 'Requests Concentration by Geographic Area',
      font: {
        family: 'Arial, sans-serif',
        size: 24,
        color: '#333'
      }
    },
    xaxis: {
      title: {
        text: 'Regions',
        font: {
          family: 'Arial, sans-serif',
          size: 18,
          color: '#7f7f7f'
        }
      },
      tickfont: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#333'
      }
    },
    yaxis: {
      title: {
        text: 'Postal Codes',
        font: {
          family: 'Arial, sans-serif',
          size: 18,
          color: '#7f7f7f'
        }
      },
      tickfont: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#333'
      }
    },
    plot_bgcolor: '#f4f4f4', // Light gray background for the plot area
    paper_bgcolor: '#ffffff', // White background for the overall chart
    margin: {
      l: 80,
      r: 40,
      b: 80,
      t: 80
    }
  };

  return (
    //@ts-ignore
    <Plot data={data} layout={layout} />
  );
};

export default RequestsHeatmap;
