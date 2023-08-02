'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import '../styles/form-main.css'

export default function LoginPage() {
  const router = useRouter()

  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const onLogin = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post('/api/login', user)
      console.log(response.data)
      router.push('/todos')
    } catch (error) {
      const message = error.response.data.error
      console.log(message)
      toast.error(message)
    }
  }

  return (
    <div className="wrapper">
      <div>
        <Toaster />
      </div>
      <h2>Login</h2>
      <form>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Password"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <input
              type="checkbox"
              id="show-password"
              onChange={(e) => {
                setShowPassword(e.target.checked)
              }}
            />
            <label htmlFor="show-password" className="password-toggle">
              Show password
            </label>
          </div>
        </div>
        <div className="button-wrapper">
          <button type="submit" onClick={onLogin}>
            Log In
          </button>
        </div>
      </form>
      <footer>
        No Account? <Link href="/signup">Create One</Link>
      </footer>
    </div>
  )
}
