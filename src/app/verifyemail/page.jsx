'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function VerifyEmailPage() {
  const router = useRouter()

  const getTokenFromQuery = () => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('token')
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromQuery()
      const toastId = toast.loading(<b>Loading...</b>)
      try {
        const response = await axios.patch('/api/account/verifyemail/' + token)
        toast.success(<b>{response.data.message}</b>, {
          id: toastId,
        })
      } catch (err) {
        toast.error(<b>{err.response.data.error}</b>, {
          id: toastId,
        })
      } finally {
        done()
      }
    }
    fetchData()
  })

  const done = () => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  return (
    <div>
      <div>
        <Toaster />
      </div>

      <div className="message-box">
        <h1>You will be redirected shortly</h1>
      </div>
    </div>
  )
}
