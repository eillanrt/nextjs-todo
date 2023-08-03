import './styles.css'

export function Header({ children, name }) {
  return (
    <header className="main-header">
      <h1>Welcome {name}!</h1>
      {children}
    </header>
  )
}
