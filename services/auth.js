const { login } = require("../controllers/user-auth");
const userSchema = require("../models/user-schema");
const messages = require("../localization/messages");

async function login(qEmail, qPassword) {
  const user = await userSchema.findOne({ email: qEmail });
  if (user == null) {
    return messages.auth.login.user_not_found;
  }
}
