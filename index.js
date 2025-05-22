const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortURL = require("./models/schema");

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/urlShortener");
app.use(express.urlencoded({ extended: false }));

// Get all short URLs
app.get("/", async (req, res) => {
  const shortUrls = await ShortURL.find();
  res.render("index", { shortUrls: shortUrls });
});

// Create a new short URL
function generateShortCode(length = 6) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// Create a new short URL
app.post("/shorturl", async (req, res) => {
  const shortCode = generateShortCode();
  await ShortURL.create({
    Full: req.body.Fullurl,
    Short: shortCode, // Save the generated short code
    clicks: 0,
  });
  res.redirect("/");
});

// Redirect using short URL
app.get("/:shortUrl", async (req, res) => {
  const shortUrls = await ShortURL.findOne({
    Short: req.params.shortUrl,
  });
  if (shortUrls == null) return res.sendStatus(404);

  shortUrls.clicks++;
  await shortUrls.save();
  res.redirect(shortUrls.Full);
});

app.listen(8000, () => {
  console.log("Server has successfully started on port 8000");
});
