import { useState, useEffect } from 'react'
import axios from 'axios'

export function TodoForm({ submit, todoValue, onChange }) {
  //const submit = async (e) => {}

  return (
    <div>
      <form>
        <input
          value={todoValue}
          type="text"
          name="name"
          placeholder="Enter todo"
          onChange={onChange}
        />
        <input onClick={submit} type="submit" value="Add" />
      </form>
    </div>
  )
}
