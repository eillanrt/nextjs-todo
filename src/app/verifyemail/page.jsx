'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function VerifyEmailPage({ searchParams }) {
  const router = useRouter()
  const [messageBoxVisible, setMessageBoxVisible] = useState(false)
  useEffect(() => {
    toast.promise(
      axios.patch('/api/account/verifyemail/' + searchParams.token),
      {
        loading: <b>Loading...</b>,
        success(response) {
          done()
          return <b>{response.data.message}</b>
        },
        error(err) {
          done()
          return <b>{err.response.data.error}</b>
        },
      }
    )
  })

  const done = () => {
    setMessageBoxVisible(true)
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  return (
    <div>
      <div>
        <Toaster />
      </div>
      {messageBoxVisible && (
        <div className="message-box">
          <h1>You will be redirected shortly</h1>
        </div>
      )}
    </div>
  )
}
