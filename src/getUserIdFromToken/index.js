import jwt from 'jsonwebtoken'

export function getUserIdFromToken(request) {
  try {
    const token = request.cookies.get('token')?.value || ''
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
    return decodedToken.id
  } catch (error) {
    console.error(error)
  }
}
