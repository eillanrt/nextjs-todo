'use client'
import axios from 'axios'
import { useEffect, useState, Suspense } from 'react'

export default function VerifyEmailPage({ searchParams }) {
  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.token
      const response = await axios.patch('/api/account/verifyemail/' + token)
      console.log(response)
    }
    verifyToken()
  })

  return <div></div>
}
