export default function LoginPage() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
        </div>
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>
    </div>
  )
}
