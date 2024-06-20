const express = require("express");

const cors = require("cors");
const { connectToDB } = require("./Config/db");
const router = require("./Route/transactionsrouter");

const app = express();

app.use(cors());
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", router);
app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
