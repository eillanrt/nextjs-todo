'use client'

import { useEffect, useRef, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function RevokeAccountPage() {
  const router = useRouter()
  const deleteAccBtnRef = useRef()

  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [tokenIsValid, setTokenIsValid] = useState(false)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')

  const getTokenFromQuery = () => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('token')
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromQuery()
      if (token) {
        try {
          const response = await axios.get(
            '/api/revokeaccount/token/validate/' + token
          )

          setEmail(response.data.email)
          setUserId(response.data.id)
          setTokenIsValid(true)
          setIsLoading(false)
        } catch (err) {
          console.log(err)
          setIsLoading(false)
          setMessage('Invalid token')
        }
      } else {
        setIsLoading(false)
        setMessage('Invalid token')
      }
    }

    fetchData()
  }, [])

  const onDeleteAccount = () => {
    const token = getTokenFromQuery()
    toast.promise(axios.delete('/api/revokeaccount/' + `${token}`), {
      loading() {
        deleteAccBtnRef.current.disabled = true
        return <b>Deleting...</b>
      },
      success() {
        router.push('/login')
        return <b>Account revoked successfully</b>
      },
      error(err) {
        console.error(err)
      },
    })
  }

  let toRender = <></>

  if (isLoading) {
    toRender = <h1>Loading...</h1>
  } else if (!isLoading && !tokenIsValid) {
    toRender = <h1>{message}</h1>
  } else {
    toRender = (
      <form>
        <p>Are you sure you want to delete the account linked to {email}?</p>
        <button ref={deleteAccBtnRef} onClick={onDeleteAccount}>
          DELETE
        </button>
      </form>
    )
  }

  return (
    <div className="revoke-acc">
      <div>
        <Toaster />
      </div>
      {toRender}
    </div>
  )
}
