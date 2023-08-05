'use client'
import { useState, useEffect, useRef } from 'react'
import { Header } from '../components/Header'
import { NavLinks } from '../components/NavLinks'
import { ProfileLink } from '../components/ProfileLink'
import { ProfileCard } from '../components/ProfileCard'
import { DeleteAccount } from '../components/DeleteAccount'
import { LogoutBtn } from '../components/LogoutBtn'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { formatMongooseTimestamp } from '@/formatMongooseTimestamp'

export default function ProfilePage() {
  const router = useRouter()
  const deleteAccountBtnRef = useRef()

  const [user, setUser] = useState({})
  const [todos, setTodos] = useState([])
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/todos')
        //setIsLoading(false)

        const { todos, user } = response.data

        setTodos(todos)
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const onLogout = () => {
    toast.promise(axios.post('/api/logout'), {
      loading: <b>Logging out...</b>,
      success(response) {
        router.push('/login')
        return <b>{response.data.message}</b>
      },
      error(err) {
        return <b>{err.response.data.error}</b>
      },
    })
  }

  const onDeleteAccount = async (e) => {
    e.preventDefault()

    const deleteAccAPI =
      '/api/account/delete/' + `${user._id}/${deleteAccountPassword}`
    deleteAccountBtnRef.current.disabled = true

    const toastId = toast.loading(<b>Deleting your account</b>)
    try {
      const response = await axios.delete(deleteAccAPI)

      router.push('/login')
      toast.success(<b>{response.data.message}</b>, { id: toastId })
    } catch (error) {
      toast.error(<b>{error.response.data.error}</b>, { id: toastId })
    } finally {
      deleteAccountBtnRef.current.disabled = false
      toast.remove(toastId)
    }
  }

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <Header name={user.name}>
        <NavLinks>
          <Link href="/todos" className="nav-link">
            Todos
          </Link>
          <ProfileLink href="/profile" />
          <LogoutBtn onLogout={onLogout} />
        </NavLinks>
      </Header>
      <ProfileCard
        name={user.name}
        email={user.email}
        isVerified={user.isVerified}
        joinedAt={formatMongooseTimestamp(user.createdAt)}
        id={user._id}
        todos={todos}
      />
      <DeleteAccount
        value={deleteAccountPassword}
        ref={deleteAccountBtnRef}
        id={user._id}
        onChange={(e) => setDeleteAccountPassword(e.target.value)}
        onSubmit={onDeleteAccount}
      />
    </div>
  )
}
