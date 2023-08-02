export function TodoItem({ name, done }) {
  return (
    <div>
      <p>{name}</p>

      <button>Delete</button>
    </div>
  )
}
