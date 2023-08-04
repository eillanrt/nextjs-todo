import './styles.css'

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
        <div>
          <input
            type="checkbox"
            onChange={onDone}
            id="todo-done"
            checked={done}
          />
          <label htmlFor="todo-done">Done</label>
        </div>
        <button id={`del-${id}-btn`} className="todo-delete" onClick={onDelete}>
          Delete
        </button>
      </footer>
    </div>
  )
}
