const { Category, Register, Transfer, User } = require("../db.js");

const categories = {
  gain: ["salary", "deposit"],
  loss: [
    "withdrawl",
    "electricity",
    "water",
    "gas",
    "internet",
    "food",
    "insurance",
    "school",
  ],
  both: ["rentals", "bank transfer", "wire transfer", "donations", "other"],
};

const preloadCategory = async () => {
  try {
    for (let [key, value] of Object.entries(categories)) {
      await Promise.all(
        value.map((e) =>
          Category.findOrCreate({
            where: { name: e },
            defaults: {
              name: e,
              type: key,
            },
          })
        )
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

const users = [
  { email: "arseneblavier46@gmail.com", admin: true },
  { email: "arseneblavier46bis@gmail.com", admin: false },
];

const preloadUser = async () => {
  try {
    await Promise.all(
      users.map((e) =>
        User.findOrCreate({
          where: { email: e.email },
          defaults: {
            email: e.email,
            admin: e.admin,
          },
        })
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const registers = [
  {
    name: "main",
    amount: 1500000,
    currency: "USD",
    user: "arseneblavier46@gmail.com",
  },
];

const preloadRegister = async () => {
  try {
    await Promise.all(
      registers.map(async (e) => {
        const newRegister = await Register.findOrCreate({
          where: { name: e.name },
          defaults: {
            name: e.name,
            amount: e.amount,
            currency: e.currency,
          },
        });
        if (newRegister[1]) {
          const user = await User.findOne({ where: { email: e.user } });
          if (user) await user.addRegister(newRegister[0]);
        }
      })
    );
  } catch (error) {
    throw new Error(error);
  }
};

const transfers = [
  {
    concept: "paying a bill",
    day: new Date("2022/08/22"),
    time: "15:33",
    amount: 10000,
    type: "loss",
    register: "main",
    category: "electricity",
  },
];

const preloadTransfer = async () => {
  try {
    await Promise.all(
      transfers.map(async (e) => {
        const newTransfer = await Transfer.findOrCreate({
          where: { concept: e.concept, day: e.day, time: e.time },
          defaults: {
            concept: e.concept,
            day: e.day,
            time: e.time,
            amount: e.amount,
            type: e.type,
          },
        });
        if (newTransfer[1]) {
          const register = await Register.findOne({
            where: { name: e.register },
          });
          if (register) await register.addTransfer(newTransfer[0]);
          const category = await Category.findOne({
            where: { name: e.category },
          });
          if (category) await category.addTransfer(newTransfer[0]);
        }
      })
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  preloadCategory,
  preloadUser,
  preloadRegister,
  preloadTransfer,
};
