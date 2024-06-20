import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Text,
} from "@chakra-ui/react";

function TransactionTable() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/transactions",
        {
          params: { search, month, page, perPage },
        }
      );
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, month, page, perPage]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    setPage(1); // Reset to first page when month changes
  };

  useEffect(() => {
    console.log(month);
  }, [month]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Input
          placeholder="Search transaction"
          value={search}
          onChange={handleSearchChange}
          width={300}
        />
        <Select
          placeholder="Select month"
          value={month}
          onChange={handleMonthChange}
          width={200}
        >
          <option value="">All months</option>
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
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Category</Th>
            <Th>Sold</Th>
            <Th>Image</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.id}</Td>
              <Td>{transaction.title}</Td>
              <Td>{transaction.description}</Td>
              <Td>{transaction.price}</Td>
              <Td>{transaction.category}</Td>
              <Td>{transaction.sold ? "Yes" : "No"}</Td>
              <Td>
                <img
                  src={transaction.image}
                  alt={transaction.title}
                  width={50}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" mt={4}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Text>
          Page {page} / {Math.ceil(total / perPage)}
        </Text>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(total / perPage)}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
}

export default TransactionTable;
