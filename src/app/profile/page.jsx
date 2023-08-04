'use client'
import { useState, useEffect } from 'react'
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

  const onDeleteAccount = (id) => {
    toast.promise(
      axios.delete('/api/account/delete/' + `${id}/${deleteAccountPassword}`),
      {
        loading() {
          document.getElementById(`del-${id}-account-btn`).disabled = true
          return <b>Deleting your data...</b>
        },
        success(response) {
          document.getElementById(`del-${id}-account-btn`).disabled = false
          router.push('/login')
          return <b>{response.data.message}</b>
        },
        error(err) {
          return <b>{err.response.data.error}</b>
        },
      }
    )
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
        id={user._id}
        onChange={(e) => setDeleteAccountPassword(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault()
          onDeleteAccount(user._id)
        }}
      />
    </div>
  )
}
