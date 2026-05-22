const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Get user cart
const getCart = async (req, res) => {
  try {

    const { userId } = req.params

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")

    if (!cart) {
      return res.json({
        items: []
      })
    }

    res.json(cart)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

// Add product to cart
const addToCart = async (req, res) => {
  try {

    const {
      userId,
      productId,
      quantity
    } = req.body

    // Verify product exists
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    // Find existing cart
    let cart = await Cart.findOne({ user: userId })

    // Create cart if missing
    if (!cart) {

      cart = await Cart.create({
        user: userId,
        items: []
      })

    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {

      existingItem.quantity += quantity

    } else {

      cart.items.push({
        product: productId,
        quantity
      })

    }

    await cart.save()

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product")

    res.json(updatedCart)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {

    const {
      userId,
      productId
    } = req.body

    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      })
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    )

    await cart.save()

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.product")

    res.json(updatedCart)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart
}