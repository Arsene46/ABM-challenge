const { Router } = require("express");
const { Op } = require("../db.js");
// const { } = require('./controllers.js');

const router = Router();

router.get("/", (req, res) => {
  res.send("si funco");
});

module.exports = router;
