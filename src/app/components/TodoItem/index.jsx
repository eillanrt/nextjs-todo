export function TodoItem({ name, done, onDelete, id }) {
  return (
    <div className="todo-item">
      <h1 className="todo-name">{name}</h1>
      <button className="todo-delete" onClick={onDelete}>
        Delete
      </button>
    </div>
  )
}
