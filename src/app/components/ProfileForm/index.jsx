import './styles.css'

export function ProfileForm({
  name,
  email,
  password,
  newPassword,
  confirmNewPassword,
  id,
  joinedAt,
  isVerified,
  todos,
  fixedUserData,
  onSubmit,
  nameOnChange,
  emailOnChange,
  currentPasswordOnChange,
  newPasswordOnChange,
  confirmNewPasswordOnChange,
  onVerifyEmail,
}) {
  const doneTodos = todos.filter((todo) => todo.done).length
  const showSaveBtn =
    name !== fixedUserData.name ||
    email !== fixedUserData.email ||
    (password !== '' &&
      newPassword == confirmNewPassword &&
      newPassword !== '' &&
      confirmNewPassword !== '')

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
            onChange={emailOnChange}
          />
        </div>
        <div className="password-group">
          <div>
            <label htmlFor="current-password">Current password</label>
            <input
              type="password"
              id="current-password"
              name="current-password"
              value={password}
              placeholder="Your current password"
              onChange={currentPasswordOnChange}
            />
          </div>

          <div>
            <label htmlFor="new-password">New password</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              placeholder="Your new password"
              onChange={newPasswordOnChange}
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password">Confirm new password</label>
            <input
              type="password"
              id="confirm-new-password"
              name="confirm-new-password"
              value={confirmNewPassword}
              placeholder="Confirm password"
              onChange={confirmNewPasswordOnChange}
            />
          </div>
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
          <button onClick={onVerifyEmail}>Verify email</button>
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
