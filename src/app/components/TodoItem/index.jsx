import '../../styles/TodoItem.css'

export function TodoItem({ name, done, onDelete, onDone, id }) {
  return (
    <div className="todo-item">
      <h1
        className="todo-name"
        style={{
          textDecoration: done ? 'line-through' : 'none',
        }}
      >
        {name}
      </h1>
      <footer>
        <input type="checkbox" onChange={onDone} checked={done} />
        <button id={`del-${id}-btn`} className="todo-delete" onClick={onDelete}>
          Delete
        </button>
      </footer>
    </div>
  )
}
