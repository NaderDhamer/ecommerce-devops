import { useContext, useEffect, useState } from "react"

import API from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function Cart() {

  const { userInfo } = useContext(AuthContext)

  const [cart, setCart] = useState(null)

  const [loading, setLoading] = useState(true)

  // Fetch cart
  const fetchCart = async () => {

    try {

      const response = await API.get(
        `/cart/${userInfo._id}`
      )

      setCart(response.data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchCart()

  }, [])

  // Remove item
  const removeItem = async (productId) => {

    try {

      await API.post("/cart/remove", {
        userId: userInfo._id,
        productId
      })

      fetchCart()

    } catch (error) {

      console.error(error)

    }
  }

  // Calculate total
  const totalPrice = cart?.items?.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  )

  if (loading) {
    return <h1>Loading cart...</h1>
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Shopping Cart
      </h1>

      {cart?.items?.length === 0 ? (

        <h2>Your cart is empty</h2>

      ) : (

        <div className="space-y-6">

          {cart.items.map((item) => (

            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl shadow flex items-center justify-between"
            >

              <div className="flex items-center gap-5">

                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div>

                  <h2 className="text-2xl font-semibold">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-600">
                    Quantity: {item.quantity}
                  </p>

                  <p className="font-bold mt-2">
                    ${item.product.price}
                  </p>

                </div>

              </div>

              <button
                onClick={() => removeItem(item.product._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Remove
              </button>

            </div>

          ))}

          <div className="bg-white p-5 rounded-2xl shadow text-right">

            <h2 className="text-3xl font-bold">
              Total: ${totalPrice}
            </h2>

          </div>

        </div>

      )}

    </div>
  )
}