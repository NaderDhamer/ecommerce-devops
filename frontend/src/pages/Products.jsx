import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function Products() {

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)

  const { userInfo, logout } = useContext(AuthContext)

  // Fetch products
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await API.get("/products")

        setProducts(response.data)

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)

      }
    }

    fetchProducts()

  }, [])

  // Add to cart
  const addToCart = async (productId) => {

    try {

      await API.post("/cart/add", {
        userId: userInfo._id,
        productId,
        quantity: 1
      })

      alert("Product added to cart")

    } catch (error) {

      console.error(error)

      alert("Failed to add product")
    }
  }

  if (loading) {
    return <h1>Loading products...</h1>
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome {userInfo?.name}
          </p>

        </div>

        <div className="flex gap-4">

          <Link
  to="/cart"
  className="bg-blue-500 text-white px-5 py-2 rounded-lg"
>
  Cart
</Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {products.map((product) => (

          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-lg p-5"
          >

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <h2 className="text-2xl font-semibold mt-4">
              {product.name}
            </h2>

            <p className="text-gray-600 mt-2">
              {product.description}
            </p>

            <p className="text-xl font-bold mt-4">
              ${product.price}
            </p>

            <button
              onClick={() => addToCart(product._id)}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}