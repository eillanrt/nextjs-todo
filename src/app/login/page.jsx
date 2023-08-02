'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()

  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const onLogin = async (e) => {
    e.preventDefault()
    const response = await axios.post('/api/login', user)
    console.log(response.data)
    router.push('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>
        <div>
          <button type="submit" onClick={onLogin}>
            Log In
          </button>
        </div>
        <Link href="/signup">Create Account</Link>
      </form>
    </div>
  )
}
