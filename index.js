const express = require("express");
const morgan = require("morgan");
const { apiRoutes } = require("./routes/api-routes");
const { ensureWebToken, ensureNoWebToken } = require("./middleware/verifyJWT");
const path = require("path");
const helmet = require("helmet");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//API
app.use("/api", apiRoutes);

//-----------------------------------------------GET REQUESTS-------------------------------------------------
//Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

//Login
app.get("/login", ensureNoWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "login.html"));
});

//Sign up
app.get("/signup", ensureNoWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "signup.html"));
});

//userDashboard
app.get("/dashboard", ensureWebToken, (req, res) => {
  console.log(
    `${req.user._id}|${req.user.email}|${req.user.username} logged in.`
  );
  res.locals.user = req.user;
  res.sendFile(path.join(__dirname, "static", "dashboard.html"));
});

//verifyEmail
app.get("/verifyEmail", ensureWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "verifyEmail.html"));
});

//resetPassword
app.get("/resetPassword", ensureNoWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "resetPassword.html"));
});

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});
