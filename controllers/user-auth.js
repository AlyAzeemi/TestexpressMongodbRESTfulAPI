const mongoose = require("mongoose");
const { mongoPass } = require("../secrets.json");
const mongoPath = `mongodb+srv://aly:${mongoPass}@cluster0.fwdpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const userSchema = require("../models/user-schema");

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log(`Error connecting to database: ${e}`);
  }
}
async function signup(user) {
  try {
    await userSchema(user).save();
    return { message: "Account created successfully!", signupStatus: true };
  } catch (e) {
    console.log(`Error creating user: ${e}`);
    return {
      message: "An account affiliated with that email already exists.",
      signupStatus: false,
    };
  }
}
async function login(qEmail, qPassword) {
  try {
    console.log(qEmail, qPassword);
    const result = await userSchema.findOne({
      email: qEmail,
    });
    /*
    result.comparePassword(qPassword, function (matchError, isMatch) {
      if (matchError) {
        callback({ error: true });
      } else if (!isMatch) {
        callback({ error: true });
      } else {
        callback({ success: true });
      }
    });*/

    if (result !== null) {
      match = await result.comparePasswordAsync(qPassword);
      if (match) {
        return {
          message: "Login Successful!",
          loginStatus: true,
          userData: result,
        };
      } else {
        throw `Incorrect password for ${result.email}`;
      }
    } else {
      throw "Account doesn't exist in DB.";
    }
  } catch (e) {
    console.log(`Error logging in: ${e}`);
    return {
      message: "Either password or email is incorrect.",
      loginStatus: false,
    };
  }
}

async function test() {
  await connectToMongoDB();
  await signup();

  await login();
}

module.exports = { connectToMongoDB, login, signup };
