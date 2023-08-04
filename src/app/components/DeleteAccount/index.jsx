import './styles.css'

export function DeleteAccount({ onSubmit, onChange, value }) {
  return (
    <div className="delete-account-wrap">
      <h1>Delete your account</h1>
      <p>
        This action irreversible. By deleting your account, all of your data
        will be erased from our database immediately
      </p>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="password">
            Enter your password to delete your data
          </label>
          <input
            type="password"
            value={value}
            onChange={onChange}
            className="password"
          />
          <button type="submit" className="delete-account-button">
            Delete my account
          </button>
        </div>
      </form>
    </div>
  )
}
