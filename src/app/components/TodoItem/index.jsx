export function TodoItem({ name, done, onDelete, id }) {
  return (
    <div id={id}>
      <p>{name}</p>
      <p>{id}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}
