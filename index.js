const express = require("express");
const bodyparser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const gm = require("gm");

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view-engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.send("please upload a image!");
  }
  console.log(req.file.path);
  gm(req.file.path).write("output.jpg", function (err) {
    if (err) console.log(err);
    res.download("output.jpg");
  });
}); //for changing the extension of the uploaded image and download !

app.listen(5000, () => {
  console.log("Server is listening on post 5000");
});
