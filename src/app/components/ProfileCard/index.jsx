import './styles.css'

export function ProfileCard({ name, email, id, joinedAt, isVerified, todos }) {
  const doneTodos = todos.filter((todo) => todo.done).length

  return (
    <div className="profile-card">
      <h1>{name}</h1>
      <ul className="profile-data">
        <li>Email: {email}</li>
        <li>userID: {id}</li>
        <li>Joined: {joinedAt}</li>
        <li>
          {isVerified
            ? 'Your email address is verified'
            : 'Your email address is not verified'}
        </li>
      </ul>
      <footer>
        <ul>
          <li>Todo&apos;s done: {doneTodos}</li>
          <li>Todo&apos;s left: {todos.length - doneTodos}</li>
          <li>Total: {todos.length}</li>
        </ul>
      </footer>
    </div>
  )
}
