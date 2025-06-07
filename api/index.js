const express = require("express");
const kokoroYakuNovelRoutes = require("../data/src/router/router");

const app = express();
// const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/novel", kokoroYakuNovelRoutes);

// Start servermodule.exports = app;
module.exports = app;