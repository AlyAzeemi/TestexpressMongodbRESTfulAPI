const { router } = require("express");
const mongoose = require("mongoose");
const { mongoPass } = require("../secrets.json");
const mongoPath = `mongodb+srv://aly:${mongoPass}@cluster0.fwdpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

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

router.post("/login", () => {});
router.post("/signup", () => {});
