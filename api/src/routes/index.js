const { Router } = require("express");
const { Op, Category, Register, Transfer, User } = require("../db.js");
const transfersRouter = require("./transfers");
// const { } = require('./controllers.js');

const router = Router();
router.use("/transfers", transfersRouter);

router.get("/", (req, res) => {
  res.send("hello");
});

module.exports = router;
