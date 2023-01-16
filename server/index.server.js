const express = require("express");
const cors = require("cors");
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors());

const registerRoute = require("./routes/register.route");

app.use("/register", registerRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
