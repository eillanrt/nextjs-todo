export function accountCreatedEmailBody({ name, revokeAccountToken }) {
  const link =
    process.env.BASE_URL + `/revokeaccount?token=${revokeAccountToken}`

  return `Welcome ${name}
<div>
An account was created on ${process.env.BASE_URL} using this email address. <br/>
If you did not create an account using this email address, you can delete the account linked with email address by going through this link:
<p>${link}</p> 
</div>
`
}
