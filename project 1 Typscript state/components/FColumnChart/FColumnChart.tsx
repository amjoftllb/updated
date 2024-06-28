import React from "react";
import Chart from "react-apexcharts";
import "./fcolumn-chart.css";
import { ChartData } from "../../types";

interface FColumnChartProps {
  graphData: {
    title: string;
    graph_type: string;
    description: string;
    series: {
      name: string;
      type: string;
      data: any;
    };
  };
}

const FColumnChart = ({ graphData }: FColumnChartProps) => {
  const data: ChartData = {
    options: {
      fill: {
        colors: ["#beaee2"],
      },
      dataLabels: {
        enabled: true,
        style: { colors: ["#6b6b6b"] },
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          dataLabels: {
            position: "top",
          },
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter(val) {
            return `${val}%`;
          },
        },
      },
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories:
          graphData?.series?.data?.length > 0 &&
          graphData?.series?.data.map(
            (_: any, index: any) => `Category ${index + 1}`
          ),
      },
    },
    series: [
      {
        name: graphData?.series.name,
        data: graphData?.series.data,
      },
    ],
  };

  return (
    <div className="fcolumn-chart-container">
      <h2>{graphData?.title}</h2>
      <p>{graphData?.description}</p>
      <Chart
        options={data.options}
        series={data.series}
        type="bar"
        width={500}
        height={300}
      />
    </div>
  );
};

export default FColumnChart;
