'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import '../styles/form-main.css'

export default function SignupPage() {
  const router = useRouter()

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSignUp = (e) => {
    e.preventDefault()
    toast.promise(axios.post('/api/signup', user), {
      loading: <b>Processing...</b>,
      success(response) {
        router.push('/login')
        return <b>{response.data.message}</b>
      },
      error(err) {
        return <b>{err.response.data.error}</b>
      },
    })
  }

  return (
    <div className="wrapper">
      <div>
        <Toaster />
      </div>
      <h2>Create Account</h2>
      <form>
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <br />
            <input
              value={user.name}
              maxLength="20"
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
              type={showPassword ? 'text' : 'password'}
              minLength="8"
              name="password"
              id="password"
              placeholder="Password"
              className="password"
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
          <div>
            <label htmlFor="show-password">Confirm Password</label>
            <input
              value={user.confirmPassword}
              type={showConfirmPassword ? 'text' : 'password'}
              minLength="8"
              name="show-password"
              id="show-password"
              placeholder="Confirm password"
              className="password"
              required
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <input
              type="checkbox"
              id="show-password"
              onChange={(e) => {
                setShowConfirmPassword(e.target.checked)
              }}
            />
            <label htmlFor="show-password" className="password-toggle">
              Show password
            </label>
          </div>
        </div>
        <div className="button-wrapper">
          <button type="submit" onClick={onSignUp}>
            Create Account
          </button>
        </div>
      </form>
      <footer>
        Already have an account? <Link href={'/login'}>Log in</Link>
      </footer>
    </div>
  )
}
