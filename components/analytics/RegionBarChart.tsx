'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const RegionBarChart = ({
  centers
}: {
  centers: { assignedCenter: string; count: number }[];
}) => {
  let X = [];
  let Y = [];
  for (let i = 0; i < centers.length; i++) {
    X.push(centers[i].assignedCenter);
    Y.push(centers[i].count);
  }

  const data = [
    {
      x: X,
      y: Y,
      type: 'bar',
      marker: {
        color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'], // Custom colors for each region
        opacity: 0.8
      },
      // text: ['120 requests', '90 requests', '75 requests', '80 requests'],
      textposition: 'auto'
    }
  ];

  const layout = {
    title: {
      text: 'Requests Received per Geographical Region',
      font: {
        family: 'Arial, sans-serif',
        size: 24,
        color: '#333'
      }
    },
    xaxis: {
      title: {
        text: 'Region',
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
      },
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: {
        text: 'Number of Requests',
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
      },
      showgrid: true,
      gridcolor: '#e9e9e9',
      //set max of y-axis to 10
      range: [0, 10]
    },
    plot_bgcolor: '#f4f4f4', // Light gray background for plot area
    paper_bgcolor: '#ffffff', // White background for the paper
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 70
    },
    hovermode: 'closest', // Enhances interactivity
    bargap: 0.2 // Adds space between bars
  };
  //@ts-ignore
  return <Plot data={data} layout={layout} />;
};

export default RegionBarChart;
