// App.js

import { Box, ChakraProvider, Text } from "@chakra-ui/react";
import TransactionTable from "./Components/TransactionTable";
import Statistics from "./Components/Statistics";
import BarChart from "./Components/Barchart";
// import Transactions from './Transactions';
// import Statistics from './Statistics';
// import BarChart from './BarChart';
// import PieChart from './PieChart';

const App = () => {
  return (
    <ChakraProvider>
      <Box
        p={5}
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        <Box
          textAlign={"center"}
          mb={10}
          borderRadius={"50%"}
          backgroundColor={"#B2F5EA"}
          width={"200px"}
          height={"200px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={"24px"} fontWeight={500}>
            Transaction Dashboard
          </Text>
        </Box>
        <TransactionTable />
        {/* <h1>Statistics</h1>
      <Statistics statistics={statistics} />
      <h1>Bar Chart</h1>
      <BarChart barChartData={barChartData} />
      <h1>Pie Chart</h1>
      <PieChart pieChartData={pieChartData} /> */}

        <Statistics />
        <BarChart />
      </Box>
    </ChakraProvider>
  );
};

export default App;
