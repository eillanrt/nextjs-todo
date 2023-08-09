import ejs from 'ejs'
import fs from 'fs/promises'

export async function forgotPasswordEmailBody(user) {
  const link =
    process.env.BASE_URL + `/resetpassword?token=${user.forgotPasswordToken}`

  const html = await fs.readFile('src/emailBody/forgotPasswordEmailBody.ejs', {
    encoding: 'utf-8',
    flag: 'r',
  })

  return ejs.render(html, {
    name: user.name,
    link,
  })
}
