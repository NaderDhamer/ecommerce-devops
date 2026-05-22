const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const productRoutes = require("./routes/productRoutes")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const cartRoutes = require("./routes/cartRoutes")
dotenv.config()

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Ecommerce DevOps API Running"
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})