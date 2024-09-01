import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const TrendOverTimeChart = ({
  dates
}: {
  dates: { date: string; count: number }[];
}) => {
  let X = [];
  let Y = [];
  let texts = [];
  for (let i = 0; i < dates.length; i++) {
    X.push(dates[i].date);
    Y.push(dates[i].count);
    texts.push(`${dates[i].count} requests`);
  }
  const data = [
    {
      x: X,
      y: Y,
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        color: '#1f77b4', // Custom marker color
        size: 8 // Marker size
      },
      line: {
        color: '#1f77b4', // Line color matching the markers
        width: 3 // Line width
      },
      text: texts,
      textposition: 'top center'
    }
  ];

  const layout = {
    title: {
      text: 'Trend of Requests Over Time',
      font: {
        family: 'Arial, sans-serif',
        size: 24,
        color: '#333'
      }
    },
    xaxis: {
      title: {
        text: 'Time of Day',
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

      range: [0, 10]
    },
    plot_bgcolor: '#f4f4f4', // Light gray background for plot area
    paper_bgcolor: '#ffffff', // White background for the paper
    margin: {
      l: 60,
      r: 40,
      b: 60,
      t: 80
    },
    hovermode: 'x' // Show hover info along the x-axis
  };

  //@ts-ignore
  return <Plot data={data} layout={layout} />;
};

export default TrendOverTimeChart;
