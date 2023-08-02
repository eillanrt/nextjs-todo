'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const router = useRouter()
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })

  const onSignUp = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/api/signup', user)
      console.log(response)
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Create Account</h2>
      <form>
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              value={user.name}
              type="name"
              name="name"
              id="name"
              placeholder="Your name"
              required
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={user.email}
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
            <input
              value={user.password}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        </div>
        <div>
          <button type="submit" onClick={onSignUp}>
            Create Account
          </button>
        </div>
      </form>
      <Link href={'/login'}>Log in</Link>
    </div>
  )
}
