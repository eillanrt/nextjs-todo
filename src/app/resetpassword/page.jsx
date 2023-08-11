'use client'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const submitBtnRef = useRef()

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  })

  const [isValidToken, setIsValidToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [showNewPassword, setShowNewPasword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmPassword] = useState(false)

  const getTokenFromQuery = () => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('token')
  }

  useEffect(() => {
    const token = getTokenFromQuery()
    if (token) {
      axios
        .get('/api/forgotpassword/validate/' + token)
        .then((response) => {
          setIsValidToken(true)
          setIsLoading(false)
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error)
          setIsLoading(false)
        })
    } else {
      setErrorMessage('Invalid token')
      setIsLoading(false)
    }
  }, [])

  const changePassword = async (e) => {
    e.preventDefault()
    const token = getTokenFromQuery()

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

  if (isLoading) {
    toRender = <h1>Loading...</h1>
  }

  if (!isValidToken && !isLoading) {
    toRender = <div>{errorMessage}</div>
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
