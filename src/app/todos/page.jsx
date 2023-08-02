'use client'
import { useState, useEffect } from 'react'
import { TodoForm } from '../components/TodoForm'
import { TodoItem } from '../components/TodoItem'
import axios from 'axios'
import Link from 'next/link'

export default function TodoPage() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [todoValue, setTodoValue] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/todos')
        setIsLoading(false)
        setTodos(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submit todo')
    try {
      const response = await axios.post('/api/todos', { name: todoValue })
      console.log(response)
      setTodos((prev) => [
        ...prev,
        {
          name: todoValue,
          done: false,
        },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Link href="/api/logout">Log out</Link>
      <TodoForm
        submit={handleSubmit}
        value={todoValue}
        onChange={(e) => setTodoValue(e.target.value)}
      />
      {isLoading && <h1>Loading</h1>}
      <div>
        {todos.length === 0 && !isLoading ? (
          <h1>You have no todos</h1>
        ) : (
          todos.map((todo, i) => (
            <TodoItem key={i} name={todo.name} done={todo.done} />
          ))
        )}
      </div>
    </div>
  )
}
