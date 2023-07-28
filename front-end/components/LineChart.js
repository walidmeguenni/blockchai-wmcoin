import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const MultiLineChart = ({ labels, datasets, xAxis, yAxis ,chartType}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const chartConfig = {
        type: chartType,
        data: {
          labels,
          datasets,
        },
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: xAxis,
                color: "#1F2937",
              },
              ticks: {
                precision: 0, // Display integers only
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: yAxis,
                color: "#1F2937",
              },
              ticks: {
                precision: 0, // Display integers only
              },
            },
          },
        },
      };

      chartRef.current = new Chart(ctx, chartConfig);
    }
  }, [chartType, datasets, labels, xAxis, yAxis]);

  return <canvas ref={chartRef} height="200"></canvas>;
};

export default MultiLineChart;
