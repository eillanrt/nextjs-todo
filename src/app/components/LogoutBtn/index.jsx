import axios from 'axios'
import { useRouter } from 'next/navigation'

export function LogoutBtn() {
  const router = useRouter()

  const logOut = async () => {
    const response = await axios.post('/api/logout')
    router.push(response.data.redirect)
  }
  return (
    <button onClick={logOut} className="nav-link">
      Logout
    </button>
  )
}
