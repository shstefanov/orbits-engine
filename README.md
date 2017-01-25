# Infrastructure game engine application with THREE.js

1. Be sure you have installed:
  - mongodb ~3.2
  - nodejs ~6.7
  - g++
  - make
  - libkrb5-dev
  - libssl-dev

2. Installing dependencies

```bash
npm install
```

3. Create config/mode.json

```json
"development"
```

It will use config/development.hson to patch the config tree

4. Create config/host.json

```json
"example.com"
```

5. Create config/secret.json

```json
{ 
  "mails": {
    "auth": {
      "tls": {
        "ciphers": "SSLv3",
        "rejectUnauthorized": false
      }
    },
    "auth_defaults":{
      "from": "some.email.account@gmail.com"
    }
  }
}
```

It uses nodemailer to send mails. Read about it here:

https://community.nodemailer.com/

In short - the application passes mails.auth as first argument and mails.auth_defaults as second argument in nodemailer transporter constructor.

```javascript
var transporter = nodemailer.createTransport(transport[, defaults])

```









