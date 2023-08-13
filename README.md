# [Live production](https://tile-do.netlify.app)

## Local installation
### Clone repo
```
$ git clone https://github.com/eillanrt/tiledo-app
```

### Change into that directory
```
$ cd tiledo-app
```

### install dependencies
```
$ npm install
```

### Setup `.env`
#### Example `.env` file
```
MONGODB_URI='mongodb+srv://mongo-db-uri/test'
BASE_URL='http://localhost:3000'
NODE_ENV='development'
EMAIL_USER='email user here'
EMAIL_FROM='recipient@example.com'
EMAIL_PASS='password'
EMAIL_SERVER='sandbox.smtp.mailtrap.io'
EMAIL_PORT=2525
SECRET_TOKEN='secret'
```

#### *Note*
- You can use [Mailtrap](https://mailtrap.io) to test your emails. Create an inbox, get the necessary credentials and inject it to your `.env` file. (Refer to the example `.env` file above)

- Go to [MongoDB](https://mongodb.com) and set your own database up. Inject the MongoDB database URI in to your `.env` file.

- The nodemailer transport in `src/mailer/index.js` should be equivalent to
```js
const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'email user here',
    pass: 'password'
  },
  tls: {
    rejectUnauthorized: false
  }
})
```

### Run and open
#### Run app

```
$ npm run dev
```
#### Open your browser and open `http://localhost:3000`
