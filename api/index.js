const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const {
  preloadCategory,
  preloadUser,
  preloadRegister,
  preloadTransfer,
} = require("./src/preloadDb/preloadFunctions");

const PORT = process.env.PORT || 3001;

// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  server.listen(PORT, () => {
    console.log(`%s listening at ${PORT}`);
  });
  try {
    await preloadCategory();
    await preloadUser();
    await preloadRegister();
    await preloadTransfer();
    console.log("Preload done");
  } catch (error) {
    console.log(error);
  }
});
