export function NavLinks({ children }) {
  return (
    <nav>
      <ul>
        {children.map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </nav>
  )
}
