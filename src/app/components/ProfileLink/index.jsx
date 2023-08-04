'use client'
import Link from 'next/link'

export function ProfileLink({ href, children }) {
  return (
    <Link className="nav-link" href={href}>
      Profile
    </Link>
  )
}
