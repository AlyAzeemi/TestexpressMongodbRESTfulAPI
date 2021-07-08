const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  jwt.verify(req.token, "secretkey", async function (err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      const _data = await jwt.decode(req.token, { complete: true, json: true });
      req.user = _data["payload"];
    }
    next();
  });
}

function ensureWebToken(req, res, next) {
  try {
    const x_access_token = req.headers["cookie"].split("=")[1];
    console.log(x_access_token);
    if (typeof x_access_token !== "undefined") {
      req.token = x_access_token;
      verifyJWT(req, res, next);
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    console.log(`Something terrible has happened: ${e}`);
  }
}

module.exports = { ensureWebToken };
