import './styles.css'

export function ProfileForm({
  name,
  email,
  id,
  joinedAt,
  isVerified,
  todos,
  fixedUserData,
  onSubmit,
  nameOnChange,
  emailOnChnange,
}) {
  const doneTodos = todos.filter((todo) => todo.done).length
  const showSaveBtn =
    name !== fixedUserData.name || email !== fixedUserData.email

  return (
    <div className="profile-form-wrapper">
      <h1>Account information</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={name}
            onChange={nameOnChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={emailOnChnange}
          />
        </div>
        <div>
          <button
            className="save-info-btn"
            type="submit"
            disabled={!showSaveBtn}
          >
            Save
          </button>
        </div>
      </form>
      {!isVerified && (
        <div className="verify-email-wrapper">
          <button>Verify email</button>
        </div>
      )}
      <ul className="profile-data">
        <li>userID: {id}</li>
        <li>Joined: {joinedAt}</li>
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
