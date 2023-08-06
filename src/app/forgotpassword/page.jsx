'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const submitBtnRef = useRef()
  const [email, setEmail] = useState('')

  const submitEmail = async (e) => {
    e.preventDefault()

    submitBtnRef.current.disabled = true
    const toastId = toast.loading(<b>Loading</b>)

    try {
      const response = await axios.post('/api/forgotpassword/generate', {
        email,
      })
      console.log(response)
    } catch (err) {
    } finally {
      // We wont notify whether or not we actually sent new email to the user for privacy reasons
      toast.success(<b>Check your email</b>, { id: toastId })
      submitBtnRef.current.disabled = false
    }
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
            required
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
