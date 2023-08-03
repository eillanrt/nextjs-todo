'use client'
import { useState, useEffect } from 'react'
import { TodoForm } from '../components/TodoForm'
import { TodoItem } from '../components/TodoItem'
import { Header } from '../components/Header'
import { Nav } from '../components/Nav'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [todoValue, setTodoValue] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/todos')
        setIsLoading(false)

        const { todos, user } = response.data

        setTodos(todos)
        setUserName(user.name)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    toast.promise(axios.post('/api/todos', { name: todoValue }), {
      loading: 'Adding...',
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
    console.log(e.target.checked)
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

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <Header name={userName}>
        <Nav />
      </Header>
      <TodoForm
        submit={handleSubmit}
        value={todoValue}
        numOfCharacters={todoValue.length}
        onChange={(e) => {
          setTodoValue(e.target.value)
        }}
      />
      {isLoading && <h1>Loading</h1>}
      <div className="todo-container">
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
