import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

import API from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const response = await API.post("/auth/register", {
        name,
        email,
        password
      })

      login(response.data)

      navigate("/products")

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Registration failed"
      )

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded-lg mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Register
        </button>

      </form>

    </div>
  )
}