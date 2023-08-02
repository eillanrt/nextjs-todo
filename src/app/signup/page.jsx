'use client'

export default function SignupPage() {
  return (
    <div>
      <h2>Create Account</h2>
      <form>
        <div>
          <div>
            <label htmlFor="name">Name</label>
            <input type="name" name="name" id="name" placeholder="Your name" />
          </div>
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
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  )
}
