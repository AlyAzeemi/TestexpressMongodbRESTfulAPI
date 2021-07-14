const { Router } = require("express");
const mongoose = require("mongoose");
const { mongoPass } = require("../secrets.json");
const mongoPath = `mongodb+srv://aly:${mongoPass}@cluster0.fwdpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const auth = require("../controllers/user-auth");
const {
  ensureWebToken,
  ensureNoWebToken,
  ensureAdmin,
} = require("../middleware/verifyJWT");
mongoose
  .connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(`Error connecting to MongoDB: ${e}`);
  });

router = Router();
router.post("/login", ensureNoWebToken, auth.login);
router.post("/signup", ensureNoWebToken, auth.signup);

router.post("/logout", ensureWebToken, auth.logout);
router.post("/resetPassword", auth.resetPassword);
router.post(
  "/sendVerificationEmail",
  ensureWebToken,
  auth.sendVerificationEmail
);
router.post("/verifyCode", ensureWebToken, auth.verifyCode);
router.post("/verifyUserByAdmin", ensureAdmin, auth.verifyUserByAdmin);
module.exports.apiRoutes = router;
