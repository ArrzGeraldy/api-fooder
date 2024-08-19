require("./app/database");
const { app } = require("./app/app.js");
const PORT = 4000;

app.listen(PORT, () => {
  console.log("App running on port: ", PORT);
});
