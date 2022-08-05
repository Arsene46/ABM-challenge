const { Router } = require("express");
const { Op, Category, Register, Transfer, User } = require("../db.js");

const router = Router();

const isDate = /^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/;
const isTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

router.get("/:registerId", async (req, res, next) => {
  const { registerId } = req.params;
  let {
    type = "all", //all, gain, loss
    category = "all", //all, ...
    order = "DESC", //DESC, ASC
    orderType = "day", //day, amount
    page = 1,
    transfersPerPage = 10,
  } = req.query;
  try {
    if (order !== "DESC") order = "ASC";
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

    const transfers = transfersInRegister?.transfers.map((e) => {
      return { ...e.dataValues, category: e.category.name };
    });

    const transfersPagination = {
      pagination: {
        page: parseInt(page),
        TotalPages: Math.ceil(transfers?.length / transfersPerPage) || 0,
      },
      transfers:
        transfers?.slice(
          (page - 1) * transfersPerPage,
          page * transfersPerPage
        ) || [],
    };

    return res.json(transfersPagination);
  } catch (error) {
    next(error);
  }
});

router.post("/:registerId", async (req, res, next) => {
  const { registerId } = req.params;
  let { concept, day, time = null, amount, type, category } = req.body;
  try {
    let errors = [];
    if (!isDate.test(day))
      errors.push(`${day} is not in a valid date format, valid = yyyy/mm/dd`);
    if (time !== null && !isTime.test(time))
      errors.push(`${time} is not in a valid time format, valid = HH:MM`);
    amount = parseFloat(amount);
    if (typeof amount !== "number" || amount % 1 !== 0)
      errors.push(`${amount} is not in a valid amount format, valid = integer`);
    if (type !== "gain" && type !== "loss")
      errors.push(`${type} is not in a valid type, valid = 'gain' or 'loss'`);
    if (errors.length !== 0) return res.status(400).json({ msg: errors });

    /////////////////////////////////////////////////
    const email = "arseneblavier46@gmail.com";
    const user = await User.findOne({ where: { email } });
    /////////////////////////////////////////////////

    let register = await Register.findByPk(parseInt(registerId), {
      where: { userId: user.id },
    });
    if (!register)
      return res.status(404).json({ msg: "No corresponding register found!" });

    let transferCaregory =
      (await Category.findOne({
        where: {
          name: category.toLowerCase(),
          type: { [Op.or]: [type, "both"] },
        },
      })) ||
      (await Category.findOne({
        where: { name: "other" },
      }));

    const newTransfer = await Transfer.create({
      concept,
      day: new Date(day),
      time,
      amount,
      type,
    });

    await register.addTransfer(newTransfer);
    await transferCaregory.addTransfer(newTransfer);
    await Register.update(
      { amount: register.amount + (type === "loss" ? -amount : amount) },
      { where: { id: registerId } }
    );
    register = await Register.findByPk(parseInt(registerId), {
      where: { userId: user.id },
    });
    return res.status(201).json(register);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
