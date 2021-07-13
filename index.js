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
//TODO: Probably get try catch blocks going here as well
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
  let baseHTML = `<h1>Dashboard</h1>
  <form action="/api/logout" method="POST"><button>Log Out</button></form>
  `;
  let verifyEmailButton = `<a href="/sendVerificationEmail"><button>Verify Email</button></a>`;
  if (req.user.isEmailVerified) {
    res.send(baseHTML + "Email verified.");
  } else {
    res.send(baseHTML + verifyEmailButton);
  }
});

//sendVerificationEmail
app.get("/sendVerificationEmail", ensureWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "sendVerificationEmail.html"));
});
//verifyCode
app.get("/verifyCode", ensureWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "verifyCode.html"));
});

//resetPassword
app.get("/resetPassword", ensureNoWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "resetPassword.html"));
});

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});
