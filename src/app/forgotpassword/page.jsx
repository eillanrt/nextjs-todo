'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const submitBtnRef = useRef()
  const [email, setEmail] = useState('')

  const submitEmail = (e) => {
    e.preventDefault()

    toast.promise(axios.post('/api/forgotpassword/generate', { email }), {
      loading() {
        submitBtnRef.current.disabled = true
        return <b>Loading...</b>
      },
      success(response) {
        console.log(response.data)
        submitBtnRef.current.disabled = false
        return <b>{response.data.message}</b>
      },
      error(err) {
        console.log(err)
        submitBtnRef.current.disabled = false
        return <b>{err.response.data.error}</b>
      },
    })
  }

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="forgot-password-wrapper">
        <form onSubmit={submitEmail}>
          <p>Enter the email address linked to your account</p>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder="Email address"
          />
          <button
            ref={submitBtnRef}
            type="submit"
            className="resetpasssword-btn"
          >
            Reset password
          </button>
        </form>
        <footer>
          <Link href="/login">Login</Link>
        </footer>
      </div>
    </>
  )
}
