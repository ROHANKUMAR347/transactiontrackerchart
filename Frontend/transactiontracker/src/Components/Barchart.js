import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Flex, Text, Select } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const [month, setMonth] = useState("6"); // Default to June
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchChartData = async (selectedMonth) => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/bar-chart",
          {
            params: { month: selectedMonth },
          }
        );
        const data = response.data;

        setChartData({
          labels: data.map((d) => d.range),
          datasets: [
            {
              label: "Transaction Count",
              data: data.map((d) => d.count),
              backgroundColor: "#b2f5ea",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData(month);
  }, [month]);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartInstance.current = chartRef.current.chartInstance;
    }
  }, []);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <Box w="full" p={4}>
      <Text fontSize={"25px"} fontWeight={500} textAlign={"center"} mb={8}>
        Bar Chart Stats
      </Text>
      <Flex justify="space-between" align="center" mb={4}>
        <Select value={month} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
      </Flex>
      <Box height="400px">
        <Bar
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  callback: function (value, index, values) {
                    return chartData.labels[index];
                  },
                },
                title: {
                  display: true,
                  text: "Price Range",
                },
              },
              y: {
                ticks: {
                  stepSize: 20,
                  max: 80, // Ensure the y-axis goes up to 80
                },
                title: {
                  display: true,
                  text: "Number of Items",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: `Transaction Count by Price Range for ${
                  months.find((m) => m.value === month)?.label
                }`,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default BarChart;
