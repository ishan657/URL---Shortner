const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortid = require("shortid");
const ShortURL = require("./models/schema");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// ✅ Only one mongoose.connect with properly read .env value
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// GET: Homepage
app.get("/", async (req, res) => {
  const shortUrls = await ShortURL.find();
  res.render("index", { shortUrls: shortUrls });
});

// POST: Create Short URL
app.post("/shorturl", async (req, res) => {
  const shortCode = shortid.generate(); // generate unique short code
  await ShortURL.create({
    Full: req.body.Fullurl,
    Short: shortCode,
  });
  res.redirect("/");
});

// GET: Redirect from short URL
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortURL.findOne({ Short: req.params.shortUrl });
  if (!shortUrl) return res.sendStatus(404);

  shortUrl.clicks++;
  await shortUrl.save();
  res.redirect(shortUrl.Full);
});

app.listen(8000, () => {
  console.log("✅ Server started on http://localhost:8000");
});
