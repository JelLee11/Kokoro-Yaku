const express = require("express");
const kokoroYakuNovelRoutes = require("../data/src/router/router");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to KokoroYaku Api - your destination for scrapping data from various novel & manga sites! Seamlessly access  id, title, image and more.");
});

app.use("/novel", kokoroYakuNovelRoutes);

// Start servermodule.exports = app;
module.exports = app;