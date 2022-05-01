const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 8080;

connectDatabase();

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
