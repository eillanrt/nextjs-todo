import ejs from 'ejs'
import fs from 'fs'

export function forgotPasswordEmailBody(user) {
  const link =
    process.env.BASE_URL + `/resetpassword?token=${user.forgotPasswordToken}`

  const html = fs.readFileSync('./forgotPasswordEmailBody.ejs', {
    encoding: 'utf-8',
    flag: 'r',
  })

  return ejs.render(html, {
    name: user.name,
    link,
  })
}
