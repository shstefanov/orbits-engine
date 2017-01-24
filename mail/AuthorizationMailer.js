const Mailer = require("infrastructure-mail/Mailer");

module.exports = Mailer.extend("AuthorizationMailer", {
  "account": "secret.mails.auth",
  "defaults": "secret.mails.auth-default",
  "sendRegistrationVerification": "auth/verification.mustache | Hello {{username}}, please, confirm your registration"
})