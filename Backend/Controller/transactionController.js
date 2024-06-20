const Transaction = require("../models/transactionschema");

// Helper function to filter transactions by month
const filterTransactionsByMonth = (transactions, month) => {
  return transactions.filter((transaction) => {
    const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
    return transactionMonth === month;
  });
};

// Controller function to list all transactions
exports.listAllTransactions = async (req, res) => {
  try {
    const { month, page = 1, perPage = 10, search } = req.query;
    let query = {};

    // Construct date range query if month is provided
    if (month && month >= 1 && month <= 12) {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 0);
      query.dateOfSale = { $gte: startDate, $lte: endDate };
    }

    // Construct search query
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { price: isNaN(parseFloat(search)) ? 0 : parseFloat(search) },
      ];
    }

    const totalCount = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ dateOfSale: "desc" });

    res.json({
      total: totalCount,
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Controller function to get statistics
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const transactions = await Transaction.find();
    const filteredTransactions = filterTransactionsByMonth(
      transactions,
      parseInt(month, 10)
    );
    const totalSaleAmount = filteredTransactions.reduce(
      (acc, curr) => acc + curr.price,
      0
    );
    const totalSoldItems = filteredTransactions.filter(
      (transaction) => transaction.sold
    ).length;
    const totalNotSoldItems = filteredTransactions.filter(
      (transaction) => !transaction.sold
    ).length;

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to generate bar chart data
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const transactions = await Transaction.find();
    const filteredTransactions = filterTransactionsByMonth(
      transactions,
      parseInt(month, 10)
    );

    const priceRanges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901-above", count: 0 },
    ];

    filteredTransactions.forEach((transaction) => {
      const price = transaction.price;
      if (price >= 0 && price <= 100) priceRanges[0].count++;
      else if (price >= 101 && price <= 200) priceRanges[1].count++;
      else if (price >= 201 && price <= 300) priceRanges[2].count++;
      else if (price >= 301 && price <= 400) priceRanges[3].count++;
      else if (price >= 401 && price <= 500) priceRanges[4].count++;
      else if (price >= 501 && price <= 600) priceRanges[5].count++;
      else if (price >= 601 && price <= 700) priceRanges[6].count++;
      else if (price >= 701 && price <= 800) priceRanges[7].count++;
      else if (price >= 801 && price <= 900) priceRanges[8].count++;
      else priceRanges[9].count++;
    });

    res.json(priceRanges);
  } catch (error) {
    console.error("Error generating bar chart data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Controller function to generate pie chart data
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const transactions = await Transaction.find();
    const filteredTransactions = filterTransactionsByMonth(
      transactions,
      parseInt(month, 10)
    );

    const categoriesMap = new Map();
    filteredTransactions.forEach((transaction) => {
      const category = transaction.category;
      categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
    });

    const pieChartData = [...categoriesMap.entries()].map(
      ([category, count]) => ({ category, count })
    );

    res.json(pieChartData);
  } catch (error) {
    console.error("Error generating pie chart data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to combine data from multiple APIs
exports.combineData = async (req, res) => {
  try {
    const { month } = req.query;
    const transactionsData = await this.listAllTransactions(req, res);
    const statisticsData = await this.getStatistics(req, res);
    const barChartData = await this.getBarChartData(req, res);
    const pieChartData = await this.getPieChartData(req, res);

    const combinedData = {
      transactionsData,
      statisticsData,
      barChartData,
      pieChartData,
    };

    res.json(combinedData);
  } catch (error) {
    console.error("Error combining data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
