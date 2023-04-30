const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const spawn = require("child_process").spawn;
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
const upload = multer({ dest: "public/source" });

app.use(cors());
app.use("/static", express.static("public"));

app.get("/", (req, res) => res.send("ok"));
app.post("/process", upload.single("image"), (req, res) => {
  const {
    selectedWidth,
    selectedHeight,
    startPointX,
    startPointY,
    endPointX,
    endPointY,
    degrees,
    flipX,
    flipY,
  } = req.body;

  if (
    selectedWidth === undefined ||
    selectedWidth === undefined ||
    startPointX === undefined ||
    startPointY === undefined ||
    endPointX === undefined ||
    endPointY === undefined ||
    degrees === undefined ||
    flipX === undefined ||
    flipY === undefined
  ) {
    return res.json({
      status: false,
    });
  }

  const sourcePath = path.resolve("./public/source", req.file.filename);
  const destinationPath = path.resolve(
    "./public/result",
    req.file.filename + ".png"
  );
  const args = [
    "./python/app.py",
    sourcePath,
    destinationPath,
    selectedWidth,
    selectedHeight,
    startPointX,
    startPointY,
    endPointX,
    endPointY,
    degrees,
    flipX,
    flipY,
  ];

  const pyspawn = spawn("python", args);

  // pyspawn.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // pyspawn.stderr.on("data", (data) => {
  //   console.log(`stderr: ${data}`);
  // });

  pyspawn.on("close", (code) => {
    if (code == 0)
      return res.json({
        status: true,
        data: {
          filename: path.basename(destinationPath),
        },
      });
    else
      return res.json({
        status: false,
      });
  });
});

app.listen(PORT, () => {
  console.log(`App started to listen at :${PORT}`);
});
