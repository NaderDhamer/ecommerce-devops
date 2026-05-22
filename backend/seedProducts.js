require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("./models/Product")

const products = [
  {
    name: "Wireless Headphones",
    price: 89.99,
    description: "Noise-cancelling over-ear headphones with Bluetooth 5.3.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Smart Coffee Maker",
    price: 119.5,
    description: "Programmable coffee maker with a built-in grinder and timer.",
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
  }
]

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        { $setOnInsert: product },
        { upsert: true }
      )
    }

    console.log("Seed products ensured")
  } catch (error) {
    console.error("Failed to seed products:", error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedProducts()
