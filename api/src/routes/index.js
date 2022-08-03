const e = require("express");
const { Router } = require("express");
const { Op, Category, Register, Transfer, User } = require("../db.js");
// const { } = require('./controllers.js');

const router = Router();

router.get("/", (req, res) => {
  res.send("si funco");
});

router.get("/transfers/:registerId", async (req, res, next) => {
  const { registerId } = req.params;
  const {
    type = "all", //all, gain, loss
    category = "all", //all, ...
    order = "DESC", //DESC, ASC
    orderType = "day", //day, amount
    page = 1,
    transfersPerPage = 10,
  } = req.query;
  try {
    /////////////////////////////////////////////////
    const email = "arseneblavier46@gmail.com";
    const user = await User.findOne({ where: { email } });
    /////////////////////////////////////////////////
    const transfersInRegister = await Register.findByPk(parseInt(registerId), {
      where: { userId: user.id },
      attributes: ["id", "name", "amount", "currency"],
      order:
        orderType === "amount"
          ? [
              [{ model: Transfer }, "amount", order],
              [{ model: Transfer }, "day", "DESC"],
              [{ model: Transfer }, "time", "DESC"],
            ]
          : [
              [{ model: Transfer }, "day", order],
              [{ model: Transfer }, "time", order],
              [{ model: Transfer }, "amount", "DESC"],
            ],
      include: {
        model: Transfer,
        where:
          type !== "gain" && type !== "loss"
            ? null
            : {
                type: type === "gain" ? "gain" : "loss",
              },
        attributes: ["concept", "day", "time", "amount", "type"],
        include: {
          model: Category,
          where: category === "all" ? null : { name: category },
          attributes: ["name"],
        },
      },
    });

    const transfers = transfersInRegister.transfers.map((e) => {
      return { ...e.dataValues, category: e.category.name };
    });

    let result = {
      pagination: {
        page: parseInt(page),
        TotalPages: Math.ceil(transfers.length / transfersPerPage),
      },
      transfers: transfers.slice(
        (page - 1) * transfersPerPage,
        page * transfersPerPage
      ),
    };

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
