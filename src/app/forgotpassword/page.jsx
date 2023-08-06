'use client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="forgot-password-wrapper">
      <form>
        <p>Enter the email address linked to your account</p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email address"
        />
        <button type="submit" className="resetpasssword-btn">
          Reset password
        </button>
      </form>
      <footer>
        <Link href="/login">Login</Link>
      </footer>
    </div>
  )
}
