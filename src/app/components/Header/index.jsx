export function Header({ children, name }) {
  return (
    <header>
      <h1>Welcome {name}!</h1>
      {children}
    </header>
  )
}
