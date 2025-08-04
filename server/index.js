const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const lookupRoutes = require("./routes/lookup");
const proposalsRoute = require("./routes/proposals");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/lookup", lookupRoutes);
app.use("/api/proposals", proposalsRoute);

app.listen(3001, () => console.log("Server running on http://localhost:3001"));