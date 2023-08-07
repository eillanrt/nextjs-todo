'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function ResetPasswordPage({ searchParams }) {
  const router = useRouter()
  const submitBtnRef = useRef()
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [token, setToken] = useState('')
  const [showNewPassword, setShowNewPasword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmPassword] = useState(false)
  const [tokenIsValid, setTokenIsValid] = useState('looding')

  useEffect(() => {
    if (!searchParams.token) {
      setTokenIsValid(false)
    }
    setToken(searchParams.token)

    const validateToken = async () => {
      try {
        const response = await axios.get(
          '/api/forgotpassword/validate/' + token
        )

        setTokenIsValid(true)
      } catch (err) {
        setTokenIsValid(false)
      }
    }
    if (token) {
      validateToken()
    }
  }, [])

  const changePassword = async (e) => {
    e.preventDefault()

    toast.promise(
      axios.patch('/api/forgotpassword/resetpassword', {
        ...passwords,
        token,
      }),
      {
        loading() {
          submitBtnRef.current.disabled = true
          return <b>Loading...</b>
        },
        success() {
          router.push('/login')
          return <b>Password changed successfully</b>
        },
        error(err) {
          submitBtnRef.current.disabled = false
          return <b>{err.response.data.error}</b>
        },
      }
    )
  }

  let toRender = <></>

  if (tokenIsValid === false) {
    toRender = <h1>Invalid token</h1>
  } else if (tokenIsValid === 'loading') {
    toRender = <h1>Loading...</h1>
  } else {
    toRender = (
      <form onSubmit={changePassword}>
        <div>
          <label htmlFor="new-password">New Password</label>
          <br />
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="new-password"
            placeholder="Enter new password"
            value={passwords.currentPassword}
            onChange={(e) => {
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }}
            required
          />
          <br />
          <input
            type="checkbox"
            id="show-new-password"
            onChange={(e) => {
              setShowNewPasword(e.target.checked)
            }}
          />
          <label htmlFor="show-new-password">Show password</label>
        </div>
        <div>
          <label htmlFor="confirm-new-password">Confirm Password</label>
          <br />
          <input
            type={showConfirmNewPassword ? 'text' : 'password'}
            id="confirm-new-password"
            placeholder="Confirm new password"
            value={passwords.newPassword}
            onChange={(e) => {
              setPasswords({ ...passwords, newPassword: e.target.value })
            }}
            required
          />
          <br />
          <input
            type="checkbox"
            id="show-confirm-password"
            onChange={(e) => {
              setShowConfirmPassword(e.target.checked)
            }}
          />
          <label htmlFor="show-confirm-password">Show confirm password</label>
        </div>
        <div>
          <button
            ref={submitBtnRef}
            type="submit"
            className="submit-reset-password"
            disabled={
              passwords.currentPassword === '' || passwords.newPassword === ''
            }
          >
            Change
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="resetpassword-wrapper">
      <div>
        <Toaster />
      </div>
      {toRender}
    </div>
  )
}
