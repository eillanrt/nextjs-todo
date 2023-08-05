import { forwardRef } from 'react'
import './styles.css'

export const DeleteAccount = forwardRef(function DeleteAccount(
  { id, onSubmit, onChange, value },
  ref
) {
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
            placeholder="Password"
            value={value}
            onChange={onChange}
            className="password"
          />
          <button
            ref={ref}
            type="submit"
            id={`del-${id}-account-btn`}
            className="delete-account-button"
          >
            Delete my account
          </button>
        </div>
      </form>
    </div>
  )
})
