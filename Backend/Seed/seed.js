const axios = require("axios");
const { connectToDB } = require("../Config/db");
const Transaction = require("../models/transactionschema");

const seedDatabase = async () => {
  try {
    await connectToDB();

    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    await Transaction.deleteMany({});

    await Transaction.insertMany(transactions);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
