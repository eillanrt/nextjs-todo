'use client'
import { useState, useEffect } from 'react'
import { TodoForm } from '../components/TodoForm'
import { TodoItem } from '../components/TodoItem'
import { Header } from '../components/Header'
import { NavLinks } from '../components/NavLinks'
import { ProfileLink } from '../components/ProfileLink'
import { LogoutBtn } from '../components/LogoutBtn'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function TodoPage() {
  const router = useRouter()
  const [todos, setTodos] = useState([])
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [todoValue, setTodoValue] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/todos')
        setIsLoading(false)

        const { todos, user } = response.data

        setTodos(todos)
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const addTodo = (e) => {
    e.preventDefault()

    toast.promise(axios.post('/api/todos', { name: todoValue }), {
      loading: <b>Adding...</b>,
      success(response) {
        const { _id, name, done } = response.data.savedTodo

        setTodos((prev) => [...prev, { _id, name, done }])
        setTodoValue('')

        return <b>{response.data.message}</b>
      },
      error(err) {
        return <b>{err.response.data.error}</b>
      },
    })
  }

  const deleteTodo = (id) => {
    toast.promise(axios.delete('/api/todos/delete/' + id), {
      loading() {
        document.getElementById(`del-${id}-btn`).disabled = true
        return <b>Deleting...</b>
      },
      success(response) {
        const deletedTodoId = response.data.deletedTodo._id

        setTodos((prev) => {
          return prev.filter(({ _id }) => {
            return _id !== deletedTodoId
          })
        })

        const deleteTodoBtns = document.querySelectorAll('.todo-delete')

        deleteTodoBtns.forEach((btn) => {
          btn.disabled = false
        })

        return <b>{response.data.message}</b>
      },
      error(err) {
        return <b>{err.response.data.error}</b>
      },
    })
  }

  const onDone = async (id, e) => {
    const response = await axios.put('/api/todos/done/' + id)

    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo._id === id) {
          return {
            ...todo,
            done: !todo.done,
          }
        }
        return todo
      })
    })
  }

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
      <TodoForm
        submit={addTodo}
        value={todoValue}
        numOfCharacters={todoValue.length}
        onChange={(e) => {
          setTodoValue(e.target.value)
        }}
      />
      <div className="todo-container">
        {isLoading && <h1>Loading</h1>}
        {todos.length === 0 && !isLoading ? (
          <h1>You have no todos</h1>
        ) : (
          todos.map((todo, i) => (
            <TodoItem
              key={i}
              id={todo._id}
              name={todo.name}
              done={todo.done}
              onDone={(e) => onDone(todo._id, e)}
              onDelete={() => deleteTodo(todo._id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
