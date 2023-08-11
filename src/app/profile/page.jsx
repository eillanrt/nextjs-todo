'use client'
import { useState, useEffect, useRef } from 'react'
import { Header } from '../components/Header'
import { NavLinks } from '../components/NavLinks'
import { ProfileLink } from '../components/ProfileLink'
import { ProfileForm } from '../components/ProfileForm'
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
  const [isLoading, setIsLoading] = useState(true)
  // the name of the user onload, to prevent change on the header
  const [userDataFixed, setUserDataFixed] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/todos')
        setIsLoading(false)

        const { todos, user } = response.data

        setTodos(todos)
        setUser({
          ...user,
          password: '',
          newPassword: '',
          confirmNewPassword: '',
        })
        setUserDataFixed(user)
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
    } catch (err) {
      toast.error(<b>{err.response.data.error}</b>, { id: toastId })
    } finally {
      deleteAccountBtnRef.current.disabled = false
    }
  }

  const updateUserData = async (e) => {
    e.preventDefault()
    const saveBtn = document.getElementById('save-info-btn')
    saveBtn.disabled = true
    const toastId = toast.loading(<b>Updating...</b>)

    try {
      const response = await axios.patch('/api/account/updateuser', {
        name: user.name,
        email: user.email,
        password: user.password,
        newPassword: user.newPassword,
        confirmNewPassword: user.confirmNewPassword,
      })

      setUserDataFixed(response.data.updatedUser)
      toast.success(<b>{response.data.message}</b>, { id: toastId })
    } catch (err) {
      toast.error(<b>{err.response.data.error}</b>, { id: toastId })
    } finally {
      saveBtn.disabled = false
    }
  }

  const onVerifyEmail = async (e) => {
    e.target.disabled = true
    const toastId = toast.loading(<b>Sending email...</b>)

    try {
      const response = await axios.post('/api/account/verifyemail/generate')
      toast.success(<b>Check your email</b>, { id: toastId })
    } catch (err) {
      console.log(err)
      toast.error(<b>{err.response.data.error}</b>, { id: toastId })
    } finally {
      e.target.disabled = false
    }
  }

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <Header name={userDataFixed.name}>
        <NavLinks>
          <Link href="/todos" className="nav-link">
            Todos
          </Link>
          <ProfileLink href="/profile" />
          <LogoutBtn onLogout={onLogout} />
        </NavLinks>
      </Header>
      {!isLoading ? (
        <>
          <ProfileForm
            name={user.name}
            email={user.email}
            password={user.password}
            newPassword={user.newPassword}
            confirmNewPassword={user.confirmNewPassword}
            isVerified={userDataFixed.isVerified}
            joinedAt={formatMongooseTimestamp(userDataFixed.createdAt)}
            id={userDataFixed._id}
            todos={todos}
            fixedUserData={userDataFixed}
            onSubmit={updateUserData}
            nameOnChange={(e) => {
              setUser({ ...user, name: e.target.value })
            }}
            emailOnChange={(e) => {
              setUser({ ...user, email: e.target.value })
            }}
            currentPasswordOnChange={(e) => {
              setUser({ ...user, password: e.target.value })
            }}
            newPasswordOnChange={(e) => {
              setUser({ ...user, newPassword: e.target.value })
            }}
            confirmNewPasswordOnChange={(e) => {
              setUser({ ...user, confirmNewPassword: e.target.value })
            }}
            onVerifyEmail={onVerifyEmail}
          />
          <DeleteAccount
            value={deleteAccountPassword}
            ref={deleteAccountBtnRef}
            id={user._id}
            onChange={(e) => setDeleteAccountPassword(e.target.value)}
            onSubmit={onDeleteAccount}
          />
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  )
}
