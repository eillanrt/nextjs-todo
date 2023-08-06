'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function VerifyEmailPage({ searchParams }) {
  useEffect(() => {
    toast.promise(
      axios.patch('/api/account/verifyemail/' + searchParams.token),
      {
        loading: <b>Loading...</b>,
        success(response) {
          return <b>{response.data.message}</b>
        },
        error(err) {
          return <b>{err.response.data.error}</b>
        },
      }
    )
  })

  return (
    <div>
      <div>
        <Toaster />
      </div>
    </div>
  )
}
