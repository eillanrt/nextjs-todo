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
    } catch (err) {
      console.log(err)
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
          <div>
            <label htmlFor="email">Email</label>
            <br />
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
          </div>
          <div className="submit-wrapper">
            <button
              ref={submitBtnRef}
              type="submit"
              className="resetpasssword-btn"
            >
              Reset password
            </button>
          </div>
        </form>
        <footer>
          <Link href="/login">Log in</Link>
        </footer>
      </div>
    </>
  )
}
