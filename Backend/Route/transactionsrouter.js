const express = require("express");
const {
  listAllTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  combineData,
} = require("../Controller/transactionController");
const router = express.Router();

router.get("/transactions", listAllTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/pie-chart", getPieChartData);
router.get("/combined-data", combineData);

module.exports = router;
