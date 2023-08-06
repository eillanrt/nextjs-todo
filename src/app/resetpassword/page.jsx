'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ResetPasswordPage({ searchParams }) {
  const router = useRouter()
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  })
  const [token, setToken] = useState('')
  const [showNewPassword, setShowNewPasword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [tokenIsValid, setTokenIsValid] = useState('looding')

  useEffect(() => {
    setToken(searchParams.token)

    const validateToken = async () => {
      try {
        const response = await axios.get(
          '/api/forgotpassword/validate/' + token
        )

        console.log(response.data)
        setTokenIsValid(true)
      } catch (err) {
        setTokenIsValid(false)
      }
    }
    if (token) {
      validateToken()
    }
  }, [searchParams.token, token])

  const changePassword = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.patch('/api/forgotpassword/resetpassword', {
        ...passwords,
        token,
      })
      console.log(response.data)
    } catch (err) {
      console.log(err)
    } finally {
      router.push('/login')
    }
  }

  let toRender = <></>

  if (tokenIsValid === false) {
    toRender = (
      <div>
        <h1>Invalid token</h1>
      </div>
    )
  } else if (tokenIsValid === 'loading') {
    toRender = <h1>Loading...</h1>
  } else {
    toRender = (
      <div>
        <form onSubmit={changePassword}>
          <div>
            <label htmlFor="new-password">New Password</label>
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
          </div>
          <div>
            <label htmlFor="confirm-new-password">Confirm Password</label>
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
          </div>
          <div>
            <button
              type="submit"
              className="submit-reset-passwors"
              disabled={
                passwords.currentPassword === '' || passwords.newPassword === ''
              }
            >
              Change
            </button>
          </div>
        </form>
      </div>
    )
  }

  return toRender
}
