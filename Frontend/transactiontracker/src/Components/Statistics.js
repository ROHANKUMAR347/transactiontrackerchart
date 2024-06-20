import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Text, Select, Stack } from "@chakra-ui/react";

function Statistics() {
  const [month, setMonth] = useState("");
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const fetchStatistics = async (selectedMonth) => {
    try {
      const response = await axios.get("http://localhost:8000/api/statistics", {
        params: { month: selectedMonth },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (month) {
      fetchStatistics(month);
    }
  }, [month]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
    >
      <Text mb={5} mt={6} fontSize={"25px"} fontWeight={500}>
        Transactions Statistics
      </Text>
      <Flex justifyContent="space-between" mb={4}>
        <Select
          placeholder="Select month"
          value={month}
          onChange={handleMonthChange}
          width={200}
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </Select>
      </Flex>

      <Flex
        direction={"column"}
        backgroundColor={"#b2f5ea"}
        p={10}
        width={["300px", "400px", "600px"]}
        justifyContent={"space-between"}
        spacing={8}
        alignItems={"center"}
        gap={5}
      >
        <Box textAlign="center" display={"flex"} gap={6}>
          <Text fontSize="lg" fontWeight="bold">
            Total Sale Amount
          </Text>
          <Text fontSize="2xl">${statistics.totalSaleAmount}</Text>
        </Box>

        <Box textAlign="center" display={"flex"} gap={6}>
          <Text fontSize="lg" fontWeight="bold">
            Total Sold Items
          </Text>
          <Text fontSize="2xl">{statistics.totalSoldItems}</Text>
        </Box>

        <Box textAlign="center" display={"flex"} gap={6}>
          <Text fontSize="lg" fontWeight="bold">
            Total Not Sold Items
          </Text>
          <Text fontSize="2xl">{statistics.totalNotSoldItems}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default Statistics;
