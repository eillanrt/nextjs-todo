import ejs from 'ejs'
import fs from 'fs/promises'

export async function verifyEmailBody(user) {
  const link = process.env.BASE_URL + `/verifyemail?token=${user.verifyToken}`

  const html = await fs.readFile('src/emailBody/verifyEmailBody.ejs', {
    encoding: 'utf-8',
    flag: 'r',
  })

  return ejs.render(html, {
    name: user.name,
    link,
  })
}
